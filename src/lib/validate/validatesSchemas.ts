import zod from 'zod';
import api from '../api/axios';
const turkeyPhoneRegex =  /^(\+90|0)?\s?5\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/;
const mailValidate = zod.string().email('Geçersiz email formatı.').trim().toLowerCase()
const nameValidate = zod.string().min(1,'İsim alanı boş olamaz').trim()
const phoneValidate = zod.string().regex(turkeyPhoneRegex,'Geçersiz telefon numarası formatı.')
const passwordValidate = zod.string().min(8,'Şifrede en az sekiz karakter, bir büyük harf, bir küçük harf olmalı.')  .regex(/[A-Z]/,'Şifrede en az bir büyük harf olmalı.').regex(/[a-z]/,'Şifrede en az bir küçük harf olmalı.').regex(/[0-9]/,'Şifrede en az bir rakam olmalı.')



const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const response = await api.post('/api/check-db',{
      email: email
    })

    if (response.status !== 200) {
      return false;
    }

    return !response.data.emailAvailable

  } catch (err: any) {
    console.error('Mail kontrol hatası.'+err)
    return false;
  }
}
const checkPhoneNumberExists = async (phoneNumber: string): Promise<boolean> => {
  try {
    const response = await api.post('/api/check-db', {
      phoneNumber: phoneNumber
    });

    if (response.status !== 200) {
      return false;
    }

    return !response.data.phoneAvailable;

  } catch (err: any) {
    console.error('Telefon kontrol hatası.'+err)
    return false;
  }
}

export const registerSchema = zod
  .object({
    name: nameValidate,
    phoneNumber: phoneValidate,
    email: mailValidate,
    password: passwordValidate,
  })
  .refine(
    async (data) => {
      const emailExists = await checkEmailExists(data.email);
      return !emailExists;
    },
    {
      message: "Bu mail zaten kayıtlı.",
      path: ['email']
    },
  )
  .refine(
    async (data) => {
      const phoneExists = await checkPhoneNumberExists(data.phoneNumber)
      return !phoneExists;
    },
    {
      message: 'Bu telefon numarası zaten kayıtlı.',
      path: ['phoneNumber']
    }
  )

export const registerBackendSchema = zod.object({
  name: nameValidate,
  phoneNumber: phoneValidate,
  email: mailValidate,
  password: passwordValidate
});

export const loginSchema = zod.object({
  email:mailValidate,
  password:passwordValidate,
  remember:zod.boolean().optional()
})

export const loginBackendSchema = zod.object({
  userData: zod.object({
    email: mailValidate,
    password: passwordValidate,
  }),
  devices: zod.string(),
});


export type LoginValues = zod.infer<typeof loginSchema>;
export type LoginBackendValues = zod.infer<typeof loginBackendSchema>;
export type RegisterValues = zod.infer<typeof registerSchema>;
export type RegisterBackendValues = zod.infer<typeof registerBackendSchema>;