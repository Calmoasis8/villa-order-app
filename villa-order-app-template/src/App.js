
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";

const translations = {
  en: {
    breakfast: "Breakfast",
    vehicle: "Vehicle",
    bbq: "BBQ",
    cleaning: "Cleaning",
    repair: "Repair",
    admin: "Admin Panel",
    requestList: "Request List",
    date: "Date",
    time: "Time",
    type: "Type",
    guestMenu: "Guests/Menu",
    notes: "Notes",
    noData: "No data available.",
    back: "← Back to Home"
  },
  ko: {
    breakfast: "조식 예약",
    vehicle: "차량 예약",
    bbq: "BBQ 예약",
    cleaning: "청소 요청",
    repair: "고장 접수",
    admin: "관리자 보기",
    requestList: "요청 리스트",
    date: "날짜",
    time: "시간",
    type: "유형",
    guestMenu: "인원/메뉴",
    notes: "요청사항",
    noData: "데이터가 없습니다.",
    back: "← 홈으로"
  }
};

export default function VillaOrderApp() {
  const [step, setStep] = useState("home");
  const [lang, setLang] = useState("en");
  const t = translations[lang];

  const [formData, setFormData] = useState({
    date: new Date(),
    time: "08:00",
    people: "",
    menu: "",
    notes: "",
    vehicleType: "",
    pickupLocation: "",
    bbqMenu: "",
    cleaningRequest: "",
    repairRequest: ""
  });
  const [requests, setRequests] = useState([]);

  const handleSubmit = async () => {
    try {
      await fetch("https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      alert("Your request has been submitted.");
      setStep("home");
    } catch (error) {
      alert("An error occurred while submitting the request.");
      console.error(error);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch("https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=read");
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    if (step === "admin") {
      fetchRequests();
    }
  }, [step]);

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-4">
      <div className="flex justify-end space-x-2">
        <Button variant={lang === "en" ? "default" : "outline"} onClick={() => setLang("en")}>EN</Button>
        <Button variant={lang === "ko" ? "default" : "outline"} onClick={() => setLang("ko")}>한글</Button>
      </div>

      {step === "home" && (
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={() => setStep("breakfast")}>🍳 {t.breakfast}</Button>
          <Button onClick={() => setStep("vehicle")}>🚐 {t.vehicle}</Button>
          <Button onClick={() => setStep("bbq")}>🍖 {t.bbq}</Button>
          <Button onClick={() => setStep("cleaning")}>🧹 {t.cleaning}</Button>
          <Button onClick={() => setStep("repair")}>🛠 {t.repair}</Button>
          <Button variant="outline" onClick={() => setStep("admin")}>📋 {t.admin}</Button>
        </div>
      )}

      {step === "admin" && (
        <Card>
          <CardContent className="space-y-4 overflow-x-auto">
            <h2 className="text-xl font-bold">📋 {t.requestList}</h2>
            <table className="w-full text-sm border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1">{t.date}</th>
                  <th className="border px-2 py-1">{t.time}</th>
                  <th className="border px-2 py-1">{t.type}</th>
                  <th className="border px-2 py-1">{t.guestMenu}</th>
                  <th className="border px-2 py-1">{t.notes}</th>
                </tr>
              </thead>
              <tbody>
                {requests.length > 0 ? requests.map((r, i) => (
                  <tr key={i}>
                    <td className="border px-2 py-1">{r.date}</td>
                    <td className="border px-2 py-1">{r.time}</td>
                    <td className="border px-2 py-1">{r.vehicleType || r.menu || r.bbqMenu || r.cleaningRequest || r.repairRequest}</td>
                    <td className="border px-2 py-1">{r.people}</td>
                    <td className="border px-2 py-1">{r.notes}</td>
                  </tr>
                )) : (
                  <tr><td className="border px-2 py-4 text-center" colSpan="5">{t.noData}</td></tr>
                )}
              </tbody>
            </table>
            <div className="text-right">
              <Button variant="outline" onClick={() => setStep("home")}>{t.back}</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
