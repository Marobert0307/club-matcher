const STEPS = ['已提交', '已查看', '面试邀请', '已录取'];

const STATUS_MAP = {
  submitted: 0,
  viewed: 1,
  interview: 2,
  admitted: 3,
};

export default function StatusTracker({ status }) {
  const currentStep = STATUS_MAP[status] ?? 0;
  return (
    <div className="flex items-center gap-1">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center gap-1">
          <div className="flex flex-col items-center">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
              i <= currentStep ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              {i < currentStep ? '✓' : i + 1}
            </div>
            <span className={`text-[9px] mt-0.5 whitespace-nowrap ${
              i <= currentStep ? 'text-teal-600 font-medium' : 'text-gray-400'
            }`}>
              {step}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-0.5 w-6 -mt-3 rounded ${i < currentStep ? 'bg-teal-500' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}
