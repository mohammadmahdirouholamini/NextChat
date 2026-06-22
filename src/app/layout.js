import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/_home/Header";
import { Footer } from "@/components/_home/Footer";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "نکست چت",
  description: "پلتفرم گفتگوی هوشمند نکست چت",
};

// شیء ترجمه فارسی برای Clerk
const faLocalization = {
  signIn: {
    start: {
      title: "ورود به نکست‌چت",
      subtitle: "خوش آمدید! برای ادامه وارد حساب خود شوید",
      actionText: "حساب کاربری ندارید؟",
      actionLink: "ثبت‌نام",
    },
  },
  errors: {
    pwned_password:
      "این رمز عبور در لیست رمزهای فاش شده در اینترنت قرار دارد و امنیت حساب شما را به خطر می‌اندازد. لطفاً از رمز دیگری استفاده کنید.",
    form_identifier_not_found: "کاربری با این مشخصات یافت نشد.",
    form_password_incorrect: "رمز عبور وارد شده اشتباه است.",
    form_param_format_invalid__email_address: "فرمت ایمیل نامعتبر است.",
    // می‌توانید خطاهای دیگر را هم اینجا اضافه کنید
  },
  signUp: { 
    start: {
      title: "ایجاد حساب کاربری",
      subtitle: "برای استفاده از خدمات ثبت‌نام کنید",
      actionText: "قبلاً ثبت‌نام کرده‌اید؟",
      actionLink: "ورود",
    },
  },
  socialButtonsBlockButton: "ادامه با {{provider}}",
  dividerText: "یا",
  formFieldLabel__emailAddress: "ایمیل",
  formFieldInputPlaceholder__emailAddress: "آدرس ایمیل خود را وارد کنید",
  formButtonPrimary: "ادامه",
  footerActionText: "حساب کاربری ندارید؟",
  footerActionLink: "ثبت‌نام",
  userProfile: {
    start: {
      title: "پروفایل کاربری",
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      localization={faLocalization}
      appearance={{
        layout: {
          socialButtonsVariant: "blockButton",
          shimmer: true,
        },
        variables: {
          // اگر فونت فارسی مثل Vazir یا Yekan داری اینجا نامش را بنویس
          fontFamily: "Tahoma, Arial, sans-serif",
        },
        elements: {
          formFieldLabel: "text-right block w-full",
          formFieldInput: "text-right",
          footerAction: "flex-row-reverse", // برای جابجایی متن و لینک در فوتر
          headerTitle: "text-center",
          headerSubtitle: "text-center",
          identityPreviewText: "text-right",
          formResendCodeLink: "text-right",
        },
      }}
    >
      <html lang="fa" dir="rtl">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased font-[Tahoma]`}
          suppressHydrationWarning={true}
        >
          <Header />
          <main>{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
