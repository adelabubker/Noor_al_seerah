// PageLoader is a reusable spinner component for full-page and inline loading states.
export default function PageLoader({ fullScreen = true }) { // كومبوننت لعرض لودر (سبينر) + يأخذ prop لتحديد هل يكون فل سكرين
  return (
    // الحاوية الرئيسية للودر
    <div className={`${fullScreen ? 'min-h-screen' : 'min-h-[240px]'} flex justify-center items-center`}>
      {/* إذا fullScreen=true ياخذ طول الشاشة كامل، غير ذلك ارتفاع ثابت */}
      
      {/* دائرة اللودينغ (سبينر) */}
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      {/* animate-spin → حركة دوران */}
      {/* rounded-full → شكل دائري */}
      {/* h-10 w-10 → الحجم */}
      {/* border-b-2 → يظهر جزء من الدائرة */}
      {/* border-primary → لون اللودينغ */}
    </div>
  );
}