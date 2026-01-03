import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose"

export default async function middleware (req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const headerToken = authHeader?.split(' ')[1];
  const {pathname} = req.nextUrl;
  const cookieToken = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;

  let token = headerToken || cookieToken;
  let newTokenCreated = false;

  const publicPaths = ['/api/login', '/api/register', '/api/refresh', '/auth/sign-in', '/auth/sign-up', '/auth/forgot-password', '/api/check-db']

  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  if (!token && refreshToken) {
    try {
      const refreshSecret = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET);
      const { payload: refreshPayload } = await jose.jwtVerify(refreshToken, refreshSecret);
      
      const accessSecret = new TextEncoder().encode(process.env.ACCES_TOKEN_SECRET);
      const newAccessToken = await new jose.SignJWT({
        userId: (refreshPayload as any).userId,
        email: (refreshPayload as any).email,
        role: (refreshPayload as any).role
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('15m')
        .sign(accessSecret);

      token = newAccessToken;
      newTokenCreated = true;
    } catch (refreshError) {
      const errorResponse = NextResponse.json(
        { message: 'Yetkisiz erişim' },
        { status: 401 }
      );
      errorResponse.cookies.delete('accessToken');
      errorResponse.cookies.delete('refreshToken');
      return errorResponse;
    }
  }

  if (!token) {
    return NextResponse.json({
      message: "Yetkisiz erişim"
    }, {status: 401})
  }

  try {
    const secret = new TextEncoder().encode(process.env.ACCES_TOKEN_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);

    const adminOnlyPaths = ['/api/users']

    if (adminOnlyPaths.some(path => pathname.startsWith(path))) {
      if (payload.role !== "admin") {
        return NextResponse.json({
          message: "Bu işlem için yetkiniz yok",
        }, {status: 403});
      }
    }

    const response : NextResponse<any> = NextResponse.next();

    if (newTokenCreated && token) {
      response.cookies.set('accessToken', token, {
        expires: new Date(Date.now() + 15 * 60 * 1000),
        httpOnly: false,
        secure: false,
        path: '/',
        sameSite: 'lax'
      });
    }

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Yetkisiz erişim' },
      { status: 401 }
    );
  }
}

export const config = {
  matcher : [
    '/dashboard/:path*',
    '/api/users/:path*',
    '/api/:path*',
  ]
}