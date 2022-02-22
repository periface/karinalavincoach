import { redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';
import { ActivatedRouteSnapshot } from '@angular/router';

function getResolvedUrl(route: ActivatedRouteSnapshot): string {
  return route.pathFromRoot
    .map((v) => v.url.map((segment) => segment.toString()).join('/'))
    .join('/');
}

export const redirectUnauthorizedToLogin = (data: ActivatedRouteSnapshot) => {
  let returnUrl = getResolvedUrl(data);
  return redirectUnauthorizedTo(['auth', returnUrl]);
};
