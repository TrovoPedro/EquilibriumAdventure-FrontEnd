export const validateUserData = ({ username, senha }) => {
  const errors = {};

  if (!username || username.trim().split(" ").length < 2) {
    errors.username = "Informe nome e sobrenome";
  }

  if (!senha || senha.length < 8) {
    errors.senha = "A senha precisa ter no mínimo 8 caracteres";
  }

  return errors;
};
