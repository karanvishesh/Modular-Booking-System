import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken) {
    console.log(accessToken, "local storage");
    const clonedRequest = req.clone({
      setHeaders: {
        'X-access-token': "Bearer " + accessToken
      }
    });

    return next(clonedRequest);
  }
  return next(req);
};
