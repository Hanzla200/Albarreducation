export default (policyContext: any) => {
  const user = policyContext.state.user;
  return Boolean(
    user &&
      (user.email === process.env.ADMIN_EMAIL || user.username === 'admin')
  );
};