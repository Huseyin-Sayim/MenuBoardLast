import { NextResponse } from "next/server";
import { setIpAddress, getUserById } from "@/services/userServices";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { ip } = body;

        if (!ip) {
            return NextResponse.json({ message: "IP adresi gereklidir" }, { status: 400 });
        }

        const cookieStore = await cookies();
        const token = cookieStore.get("accessToken")?.value;

        if (!token) {
            return NextResponse.json({ message: "Yetkisiz erişim: Token bulunamadı" }, { status: 401 });
        }

        const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
        if (!ACCESS_TOKEN_SECRET) {
            console.error("ACCESS_TOKEN_SECRET eksik");
            return NextResponse.json({ message: "Sunucu yapılandırma hatası" }, { status: 500 });
        }

        let decoded: any;
        try {
            decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
        } catch (err) {
            return NextResponse.json({ message: "Geçersiz veya süresi dolmuş oturum" }, { status: 401 });
        }

        const userId = decoded.userId;

        if (!userId) {
            return NextResponse.json({ message: "Kullanıcı kimliği bulunamadı" }, { status: 401 });
        }

        await setIpAddress(userId, ip);

        return NextResponse.json({ message: "IP adresi başarıyla güncellendi" }, { status: 200 });

    } catch (error: any) {
        console.error("IP güncelleme hatası:", error);
        return NextResponse.json({
            message: "İşlem başarısız oldu",
            error: error.message
        }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("accessToken")?.value;

        if (!token) {
            return NextResponse.json({ message: "Yetkisiz erişim: Token bulunamadı" }, { status: 401 });
        }

        const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
        if (!ACCESS_TOKEN_SECRET) {
            console.error("ACCESS_TOKEN_SECRET eksik");
            return NextResponse.json({ message: "Sunucu yapılandırma hatası" }, { status: 500 });
        }

        let decoded: any;
        try {
            decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
        } catch (err) {
            return NextResponse.json({ message: "Geçersiz veya süresi dolmuş oturum" }, { status: 401 });
        }

        const userId = decoded.userId;

        if (!userId) {
            return NextResponse.json({ message: "Kullanıcı kimliği bulunamadı" }, { status: 401 });
        }

        const user = await getUserById(userId);

        if (!user) {
            return NextResponse.json({ message: "Kullanıcı bulunamadı" }, { status: 404 });
        }

        return NextResponse.json({ ip: user.ip || 'localhost' }, { status: 200 });

    } catch (error: any) {
        console.error("IP getirme hatası:", error);
        return NextResponse.json({
            message: "İşlem başarısız oldu",
            error: error.message
        }, { status: 500 });
    }
}
