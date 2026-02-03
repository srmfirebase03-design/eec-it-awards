"use client";

import { useActionState, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { nominationSchema, NominationFormData } from "@/lib/schema";
import { submitNomination } from "@/app/actions";
import { CheckCircle2, AlertCircle, Loader2, ArrowRight, ArrowLeft, Building2, GraduationCap, Trophy } from "lucide-react";
import { clsx } from "clsx";

type Award = {
  id: string;
  title: string;
  description: string | null;
  criteria: string | null;
};

export function NominationForm({ awards }: { awards: Award[] }) {
  const [step, setStep] = useState(1);
  const [state, formAction, isPending] = useActionState(submitNomination, {
    success: false,
  });

  const {
    register,
    trigger,
    watch,
    formState: { errors },
  } = useForm<NominationFormData>({
    resolver: zodResolver(nominationSchema),
    mode: "onChange",
    defaultValues: {
        selectedAwards: []
    }
  });

  const selectedAwards = watch("selectedAwards");
  const selectedYear = watch("year");

  const filteredAwards = awards.filter((award) => {
    if (award.title.includes("Rising talent")) return selectedYear === "I";
    if (award.title.includes("Social Impact")) return ["I", "II", "III", "IV"].includes(selectedYear);
    if (selectedYear === "I") return false;
    if (award.title.includes("Final year") || award.title.includes("Outgoing Student")) return selectedYear === "IV";
    return true;
  });

  const nextStep = async () => {
    const isValid = await trigger(["name", "regNo", "email", "mobile", "year", "section"]);
    if (isValid) setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (state.success && state.uniqueId) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg border border-slate-100 p-8 md:p-12 text-center animate-in fade-in zoom-in duration-300 my-10 mx-4">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-50 p-4">
            <CheckCircle2 className="w-12 h-12 md:w-16 md:h-16 text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Nomination Submitted</h2>
        <p className="text-slate-600 mb-8 text-base md:text-lg">Your application has been successfully recorded.</p>
        
        <div className="bg-slate-50 p-6 md:p-8 rounded-xl border border-slate-200 inline-block w-full text-left">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Transaction ID</p>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
             <span className="text-2xl md:text-3xl font-mono font-bold text-slate-900 tracking-tight break-all">{state.uniqueId}</span>
             <span className="text-xs bg-white border border-slate-200 px-2 py-1 rounded text-slate-500 whitespace-nowrap">Official Record</span>
          </div>
        </div>
        <p className="text-sm text-slate-400 mt-8">A confirmation has been logged with the IT Department.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4 md:px-0">
        {/* Professional Header */}
        <div className="mb-8 md:mb-10 text-center">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider">
                <Building2 className="w-3 h-3" /> IT Department
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Annual Excellence Awards</h1>
            <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
                Nominate yourself for prestigious recognition. Please ensure all details are accurate.
            </p>
        </div>

        {/* Progress Stepper */}
        <div className="flex items-center justify-center mb-8 md:mb-10">
            <div className={clsx("flex items-center gap-2 text-sm font-medium transition-colors", step === 1 ? "text-blue-700" : "text-slate-400")}>
                <span className={clsx("w-6 h-6 rounded-full flex items-center justify-center border text-xs flex-shrink-0", step === 1 ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 bg-white")}>1</span>
                <span className="hidden sm:inline">Student Profile</span>
                <span className="sm:hidden">Profile</span>
            </div>
            <div className="w-8 md:w-16 h-px bg-slate-200 mx-2 md:mx-4"></div>
            <div className={clsx("flex items-center gap-2 text-sm font-medium transition-colors", step === 2 ? "text-blue-700" : "text-slate-400")}>
                 <span className={clsx("w-6 h-6 rounded-full flex items-center justify-center border text-xs flex-shrink-0", step === 2 ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 bg-white")}>2</span>
                <span className="hidden sm:inline">Award Selection</span>
                <span className="sm:hidden">Awards</span>
            </div>
        </div>

        <form action={formAction}>
            {/* Step 1: Personal Info */}
            <div className={clsx(step === 1 ? "block" : "hidden", "animate-in fade-in slide-in-from-left-4 duration-300")}>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-5 md:px-8 md:py-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-blue-600" />
                            Personal Details
                        </h3>
                        <span className="text-xs font-medium text-slate-500">* All fields required</span>
                    </div>
                    
                    <div className="p-6 md:p-8 grid grid-cols-1 gap-y-6 md:gap-x-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                                <input {...register("name")} type="text" className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" placeholder="e.g. John Doe" />
                                {errors.name && <p className="text-red-600 text-xs mt-1.5">{errors.name.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Registration Number</label>
                                <input {...register("regNo")} type="text" className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" placeholder="e.g. 2024IT101" />
                                {errors.regNo && <p className="text-red-600 text-xs mt-1.5">{errors.regNo.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Official Email</label>
                                <input {...register("email")} type="email" className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" placeholder="student@srm.edu.in" />
                                {errors.email && <p className="text-red-600 text-xs mt-1.5">{errors.email.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Mobile Contact</label>
                                <input {...register("mobile")} type="tel" className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" placeholder="+91 90000 00000" />
                                {errors.mobile && <p className="text-red-600 text-xs mt-1.5">{errors.mobile.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Academic Year</label>
                                <div className="relative">
                                    <select {...register("year")} className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none appearance-none cursor-pointer">
                                        <option value="">Select Year</option>
                                        <option value="I">Year I</option>
                                        <option value="II">Year II</option>
                                        <option value="III">Year III</option>
                                        <option value="IV">Year IV</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                                {errors.year && <p className="text-red-600 text-xs mt-1.5">{errors.year.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Section</label>
                                <div className="relative">
                                    <select {...register("section")} className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none appearance-none cursor-pointer">
                                        <option value="">Select Section</option>
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="C">C</option>
                                        <option value="D">D</option>
                                        <option value="E">E</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                                {errors.section && <p className="text-red-600 text-xs mt-1.5">{errors.section.message}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-5 md:px-8 bg-slate-50 border-t border-slate-100 flex justify-end">
                        <button type="button" onClick={nextStep} className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-lg shadow-sm transition-all hover:shadow-md flex items-center justify-center gap-2 text-sm md:text-base">
                            Next: Select Awards <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Step 2: Award Selection */}
            <div className={clsx(step === 2 ? "block" : "hidden", "animate-in fade-in slide-in-from-right-4 duration-300")}>
                
                {!selectedYear ? (
                     <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 md:p-12 text-center">
                        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900">Academic Year Required</h3>
                        <p className="text-slate-500 mb-6">We need your current year to show eligible awards.</p>
                        <button type="button" onClick={() => setStep(1)} className="text-blue-600 font-semibold hover:text-blue-800">Return to Profile</button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
                             <h3 className="text-lg md:text-xl font-bold text-slate-900">Select Categories</h3>
                             <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-full border border-blue-200 self-start sm:self-auto">
                                Max 2 Awards
                             </span>
                        </div>

                         {errors.selectedAwards && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                                <p className="text-sm text-red-700 font-medium">{errors.selectedAwards.message}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            {filteredAwards.map((award) => {
                                const isSelected = selectedAwards?.includes(award.id);

                                return (
                                    <div 
                                        key={award.id} 
                                        className={clsx(
                                            "bg-white rounded-xl border transition-all duration-200 overflow-hidden group",
                                            isSelected ? "border-blue-600 shadow-md ring-1 ring-blue-600/50" : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
                                        )}
                                    >
                                        <label className="block cursor-pointer">
                                            <div className="p-5 md:p-6 flex items-start gap-4">
                                                <div className="pt-1">
                                                     <input
                                                        type="checkbox"
                                                        value={award.id}
                                                        disabled={!isSelected && (selectedAwards?.length || 0) >= 2}
                                                        className="w-5 h-5 md:w-6 md:h-6 text-blue-600 border-slate-300 rounded focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                                                        {...register("selectedAwards")}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className={clsx("text-base md:text-lg font-bold mb-1 transition-colors break-words", isSelected ? "text-blue-700" : "text-slate-900")}>
                                                        {award.title}
                                                    </h3>
                                                    {award.description && <p className="text-slate-600 text-sm mb-4 leading-relaxed break-words">{award.description}</p>}
                                                    
                                                    {award.criteria && (
                                                        <div className="bg-blue-50/50 rounded-lg border-l-4 border-blue-500 p-3 md:p-4 mt-4">
                                                            <h5 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                                <Trophy className="w-3 h-3 flex-shrink-0" />
                                                                Eligibility Criteria
                                                            </h5>
                                                            <ul className="space-y-2">
                                                                {award.criteria.split(/\n\d+\.\s*/).filter(Boolean).map((line, idx) => (
                                                                    <li key={idx} className="text-xs md:text-sm text-slate-700 flex items-start gap-2.5">
                                                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></span>
                                                                        <span className="leading-relaxed">{line.replace(/^\d+\.\s*/, '').trim()}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                );
                            })}
                        </div>

                        {state.message && !state.success && (
                            <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center gap-2 text-sm font-medium">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {state.message}
                            </div>
                        )}

                        <div className="flex flex-col-reverse sm:flex-row justify-between items-center pt-8 border-t border-slate-200 mt-8 gap-4">
                            <button type="button" onClick={() => setStep(1)} className="w-full sm:w-auto text-slate-500 hover:text-slate-900 font-semibold text-sm flex items-center justify-center gap-2 px-4 py-3 rounded-lg hover:bg-slate-100 transition-colors">
                                <ArrowLeft className="w-4 h-4" /> Back to Profile
                            </button>
                            <button
                                type="submit"
                                disabled={isPending || (selectedAwards?.length || 0) === 0}
                                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg shadow-sm transition-all hover:shadow hover:-translate-y-0.5 flex items-center justify-center gap-2"
                            >
                                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Nomination"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </form>
    </div>
  );
}