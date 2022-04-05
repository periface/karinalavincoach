import { map } from 'rxjs/operators';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BaseComponent } from 'src/app/shared/components/base-component.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { DetalleZonasComponent } from './detalle-zonas/detalle-zonas.component';

@Component({
  templateUrl: './ejercicios.component.html',
  styleUrls: ['./ejercicios.component.scss'],
})
export class EjerciciosComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  displayedColumns: string[] = ['nombre', 'opciones'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  groups: any = [];
  categorias: any[] = [];
  ejercicios: any[] = [];
  /**
   *
   */
  constructor(private afs: AngularFirestore, private matDialog: MatDialog) {
    super(); //
    let sub = this.afs
      .collection('categoria-ejercicio')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as any;
            data['id'] = a.payload.doc.id;
            return { ...data };
          })
        )
      )
      .subscribe((data) => {
        this.categorias = data;
        sub.unsubscribe();
      });
    let exSb = this.afs
      .collection('ejercicios')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as any;
            data['id'] = a.payload.doc.id;
            return { ...data };
          })
        )
      )
      .subscribe((data) => {
        this.ejercicios = data;
        this.dataSource = new MatTableDataSource(this.ejercicios);
        console.log(this.ejercicios);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        exSb.unsubscribe();
      });
  }
  ngOnInit(): void {}
  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }
  cargaDetalle(value: any) {
    console.log(value);
    let sub = this.afs
      .collection('zonas-musculares', (ref) =>
        ref.where('ejercicioId', '==', value.id)
      )
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as any;
            data['id'] = a.payload.doc.id;
            return { ...data };
          })
        )
      )
      .subscribe((data) => {
        this.matDialog.open(DetalleZonasComponent, {
          data: { ejercicio: value, zonas: data },
        });
        sub.unsubscribe();
      });
  }
  changeCat($event: any) {
    console.log($event);
    const filterValue = $event;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  async guardarTodo() {
    for await (const group of this.groups) {
      let categoria = { name: group.key, id: this.afs.createId() };
      await this.afs
        .collection('categoria-ejercicio')
        .doc(categoria.id)
        .set(categoria);

      for await (const ej of group.elements) {
        let ejercicio = {
          name: ej.Ejercicio,
          id: this.afs.createId(),
          idCategoria: categoria.id,
        };
        await this.afs
          .collection('ejercicios')
          .doc(ejercicio.id)
          .set(ejercicio);
        console.log(ejercicio);
        for await (const zona of ej.zonasMusculares) {
          let zonaMuscular = {
            zonaMuscular: zona.key,
            subZonas: zona.elements,
            id: this.afs.createId(),
            ejercicioId: ejercicio.id,
          };
          await this.afs
            .collection('zonas-musculares')
            .doc(zonaMuscular.id)
            .set(zonaMuscular);
        }
      }
    }
  }
  checkEx($event: any) {
    let file = $event.target.files[0];
    var reader = new FileReader();
    reader.onload = (e: any) => {
      var obj = JSON.parse(e.target.result);
      let grp = this.groupBy(obj, 'Tipo');
      for (const key in grp) {
        if (Object.prototype.hasOwnProperty.call(grp, key)) {
          const element = grp[key];
          this.groups.push({ key, elements: this.buildElements(element) });
        }
      }
      console.log(this.groups);
    };
    reader.readAsText(file);
  }
  buildElements(elements: any[]) {
    let result = [];
    for (const ejercicio of elements) {
      let ejercicioObj = {
        Tipo: ejercicio.Tipo,
        Ejercicio: ejercicio.Ejercicio,
      } as any;
      let zonasMusculares = [];
      for (const key in ejercicio) {
        if (Object.prototype.hasOwnProperty.call(ejercicio, key)) {
          if (key === 'Tipo' || key === 'Ejercicio') continue;
          const value = ejercicio[key];
          //console.log('builder ' + key + ' ', property);
          let zonaMuscular = key.split('-');
          //console.log('zonaMuscular', zonaMuscular[0]);
          zonasMusculares.push({
            zona: zonaMuscular[0],
            subZona: zonaMuscular[1],
            carga: value,
          });
        }
      }

      zonasMusculares = zonasMusculares.filter((a) => a.carga !== '');
      let grp = this.groupBy(zonasMusculares, 'zona');

      for (const key in grp) {
        if (Object.prototype.hasOwnProperty.call(grp, key)) {
          const element = grp[key];
          if (!ejercicioObj.zonasMusculares) ejercicioObj.zonasMusculares = [];
          ejercicioObj.zonasMusculares.push({
            key,
            elements: element,
          });
        }
      }

      result.push(ejercicioObj);
    }
    return result;
  }
}
