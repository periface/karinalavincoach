export default {
  validationMessages: {
    username: [
      { type: 'required', message: 'Nombre requerido' },
      {
        type: 'minlength',
        message: 'El nombre debe ser mayor a 5 caracteres',
      },
      {
        type: 'maxlength',
        message: 'El nombre no puede ser mayor a 200 caracteres',
      },
      {
        type: 'pattern',
        message: 'El nombre solo puede tener letras',
      },
      {
        type: 'validUsername',
        message: 'Your username has already been taken',
      },
    ],
    email: [
      { type: 'required', message: 'Correo requerido' },
      { type: 'email', message: 'Correo no valido' },
    ],
    contrasena: [
      { type: 'required', message: 'Contraseña requerida' },
      {
        type: 'minlength',
        message: 'La contraseña debe tener al menos 5 caracteres',
      },
      {
        type: 'pattern',
        message: 'La contraseña debe contener mayúsculas, minúsculas y números',
      },
    ],
    confirmarContrasena: [
      { type: 'required', message: 'Confirmar contraseña requerida' },
      { type: 'confirmedValidator', message: 'Las contraseñas no coinciden' },
    ],
  },
};
