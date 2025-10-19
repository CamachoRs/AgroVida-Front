import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const token = sessionStorage.getItem("access_token");
  if (token) {
    const clonedReq = req.clone({
      headers: req.headers.set("Authorization", `bearer ${token}`)
    });

    return next(clonedReq);
  };

  return next(req);
};
