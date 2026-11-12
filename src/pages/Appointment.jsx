import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { normalizeDoctor } from "../context/apiMappers";
import { getApiErrorMessage } from "../context/apiErrors";
import RelatedDoctors from "../components/RelatedDoctors";
import axios from "axios";
import { notify } from "../components/notificationService";

const Appointment = () => {
  const { docId } = useParams();
  const { currencySymbol, backendUrl, token, getDoctosData } = useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();

  const fetchDocInfo = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/patient/doctor/${docId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setDocInfo(normalizeDoctor(data));
    } catch (error) {
      notify.error(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [backendUrl, docId, token]);

  const getAvailableSolts = useCallback(() => {
    setDocSlots([]);
    if (!docInfo?.available) return;

    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];
      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

        const slotDate = `${currentDate.getDate()}_${currentDate.getMonth() + 1}_${currentDate.getFullYear()}`;
        const isAvailable = !(docInfo?.slots_booked?.[slotDate]?.includes(formattedTime));

        if (isAvailable) {
          timeSlots.push({ datetime: new Date(currentDate), time: formattedTime });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      setDocSlots((prev) => [...prev, timeSlots]);
    }
  }, [docInfo]);

  const progressWidth = slotIndex > 0 ? (slotTime ? "w-2/3" : "w-1/3") : "w-0";

  const bookAppointment = async () => {
    if (!token) {
      notify.warning("Login to book appointment");
      return navigate("/login");
    }

    if (!slotTime) {
      return notify.error("Please select a time slot");
    }

    const date = docSlots[slotIndex]?.[0]?.datetime;
    if (!date) return notify.error("Please select a valid date");

    setSelectedDate(date);
    setShowConfirmModal(true);
  };

  const confirmBooking = async () => {
    if (!selectedDate || !slotTime) return;

    setIsBooking(true);
    const slotDate = [
      selectedDate.getFullYear(),
      String(selectedDate.getMonth() + 1).padStart(2, "0"),
      String(selectedDate.getDate()).padStart(2, "0"),
    ].join("-");
    const doctorId = Number(docId);
    if (!Number.isInteger(doctorId)) {
      notify.error("Invalid doctor ID");
      setIsBooking(false);
      return;
    }

    try {
      await axios.post(
        `${backendUrl}/patient/appointment`,
        { docId: doctorId, slotDate, slotTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      notify.success("Appointment booked successfully!");
      setShowConfirmModal(false);
      getDoctosData();
      navigate("/my-appointments");
    } catch (err) {
      notify.error(getApiErrorMessage(err, "Failed to book appointment"));
    } finally {
      setIsBooking(false);
    }
  };

  useEffect(() => {
    if (!token) {
      notify.warning("Sign in to view doctor details and book an appointment");
      navigate("/login");
      return;
    }

    setIsLoading(true);
    fetchDocInfo();
  }, [fetchDocInfo, token, navigate]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSolts();
    }
  }, [docInfo, getAvailableSolts]);

  if (isLoading) {
    return (
      <div className="bg-[#f5faf3] text-[#1f1f1f] min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] px-6 py-12 md:p-12">
        <div className="mx-auto w-[min(100%,1160px)]">
          <div className="flex flex-col lg:flex-row gap-8 animate-pulse">
            <div className="w-full lg:w-80 h-96 bg-gradient-to-br from-gray-300 to-gray-200 rounded-2xl"></div>
            <div className="flex-1 space-y-6">
              <div className="space-y-3">
                <div className="h-8 bg-gray-300 rounded-lg w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-3/4"></div>
              </div>
              <div className="h-24 bg-gray-200 rounded-lg"></div>
              <div className="h-12 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!docInfo) {
    return (
      <div className="bg-[#f5faf3] text-[#1f1f1f] min-h-screen bg-gradient-to-br from-[#f5faf3] via-[#fff] to-[#f5faf3] flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-lg text-[#4b5563]/70 font-medium">Doctor information not found</p>
          <button onClick={() => navigate("/doctors")} className="mt-4 px-6 py-2 bg-gradient-to-r from-[#46a300] to-[#46a300] text-white rounded-lg hover:shadow-lg hover:shadow-[#46a300]/50">
            Back to Doctors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f5faf3] text-[#1f1f1f] min-h-screen bg-gradient-to-br from-[#f5faf3] via-[#fff] to-[#f5faf3] py-12 md:py-14 px-4 md:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#46a300] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-[blob_7s_infinite]"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-[#46a300] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-[blob_7s_infinite] [animation-delay:2s]"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-[#46a300] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-[blob_7s_infinite] [animation-delay:4s]"></div>
      </div>

      <div className="relative z-10 mx-auto w-[min(100%,1160px)]">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-[#46a300]/70">Booking Progress</span>
            <span className="text-[#46a300]/70">{slotIndex > 0 ? 33 : 0}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#edf7e8] rounded-full overflow-hidden border border-[#dfe8d9] border-opacity-40">
            <div
              className={`h-full bg-gradient-to-r from-[#46a300] to-[#9ca3af] transition-all duration-500 ${progressWidth}`}
            ></div>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/doctors")}
            className="flex items-center gap-2 text-[#46a300] hover:text-[#4b5563] font-medium transition mb-4 backdrop-blur-md hover:translate-x-1 duration-300"
          >
            ← Back to Doctors
          </button>
          <div className="flex items-end gap-4 mb-2">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#1f1f1f] via-[#46a300] to-[#D88A63] bg-clip-text text-transparent">Book Your Appointment</h1>
              <p className="text-[#4b5563]/70 mt-2">Schedule a consultation with your healthcare provider</p>
            </div>
            <div className="hidden md:flex items-center gap-1 px-3 py-1 bg-[#46a300]/20 border border-[#dfe8d9] border-opacity-30 rounded-full text-xs text-[#4b5563] mb-1">
              <span className="w-2 h-2 bg-[#46a300] rounded-full animate-pulse"></span> Live Booking
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Doctor Profile Card - Left Side */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-[#fff]/90 via-[#fff]/80 to-[#f5faf3]/90 rounded-2xl shadow-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 sticky top-24 border border-[#dfe8d9] border-opacity-20 backdrop-blur-xl hover:border-opacity-40 group">
              {/* Glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#46a300] to-[#46a300] rounded-2xl opacity-0 group-hover:opacity-30 blur transition duration-300 pointer-events-none"></div>
              
              <div className="border-b border-[#dfe8d9] bg-gradient-to-br from-[#f5faf3] to-white p-8">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#46a300]">Doctor profile</p>
                <p className="mt-4 text-sm text-green-400">{docInfo.available ? "Appointments available" : "Currently unavailable"}</p>
              </div>

              <div className="p-6 space-y-6">
                {docInfo.image && (
                  <img
                    src={docInfo.image}
                    alt={`${docInfo.name} profile`}
                    className="h-56 w-full rounded-xl object-cover"
                    loading="eager"
                  />
                )}

                {/* Name and Verification */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h2 className="text-2xl font-bold text-[#1f1f1f]">{docInfo.name}</h2>
                  </div>
                  <p className="text-sm text-[#46a300]/70 font-medium">{docInfo.degree}</p>
                </div>

                {/* Speciality and Experience */}
                <div className="space-y-3 pb-6 border-b border-[#dfe8d9] border-opacity-20">
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="text-xs text-[#46a300]/60 font-medium">Speciality</p>
                      <p className="text-[#1f2937] font-semibold">{docInfo.speciality}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="text-xs text-[#46a300]/60 font-medium">Experience</p>
                      <p className="text-[#1f2937] font-semibold">{docInfo.experience}</p>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="space-y-2">
                  <p className="text-xs text-[#46a300]/60 font-medium">PATIENT RATING</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg shadow-[0_0_20px_rgb(102_112_133_/_25%)]">★★★★★</span>
                    <span className="text-sm text-[#46a300]/70 font-medium">(487 reviews)</span>
                  </div>
                </div>

                {/* About */}
                <div className="space-y-2 pb-6 border-b border-[#dfe8d9] border-opacity-20">
                  <p className="text-xs text-[#46a300]/60 font-medium">ABOUT</p>
                  <p className="text-sm text-[#4b5563]/80 leading-relaxed">{docInfo.about}</p>
                </div>

                {/* Consultation Fee */}
                <div className="bg-gradient-to-br from-[#edf7e8]/70 to-white/70 rounded-xl p-4 space-y-1 border border-[#dfe8d9] border-opacity-50 shadow-[0_0_15px_rgb(59_130_125_/_12%)]">
                  <p className="text-xs text-[#46a300]/60 font-medium">CONSULTATION FEE</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-[#46a300] to-[#4b5563] bg-clip-text text-transparent">
                    {currencySymbol}{docInfo.fees}
                  </p>
                  <p className="text-xs text-[#46a300]/50">One-time consultation charge</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Section - Right Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Date Selection Card */}
            <div className="bg-gradient-to-br from-[#f5faf3] via-[#f5faf3] to-[#fff] rounded-2xl shadow-2xl p-5 sm:p-8 hover:shadow-2xl transition-all border border-[#dfe8d9] border-opacity-30 hover:border-opacity-60 backdrop-blur-lg group">
              {/* Glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#46a300] to-[#46a300] rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-300 pointer-events-none"></div>
              
              <div className="relative">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-[#1f2937] flex items-center gap-2 mb-1">
                    Select Date
                  </h3>
                  <p className="text-sm text-[#4b5563]">Choose your preferred appointment date</p>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {docSlots.map((slots, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSlotIndex(i);
                        setSlotTime("");
                      }}
                      className={`min-w-24 px-4 py-4 rounded-xl text-center font-semibold transition-all duration-200 flex-shrink-0 border ${
                        slotIndex === i
                          ? "bg-gradient-to-br from-[#46a300] to-[#46a300] text-white shadow-lg shadow-[#46a300]/30 scale-105 border-[#46a300] shadow-[0_0_20px_rgb(59_130_125_/_20%)]"
                          : "bg-[#f5faf3] text-[#1f2937] hover:bg-[#dfe8d9] border-[#dfe8d9] border-opacity-30 hover:border-opacity-60 hover:shadow-lg hover:shadow-[#46a300]/20"
                      }`}
                    >
                      <div className="text-xs opacity-90 mb-1">{daysOfWeek[slots[0]?.datetime.getDay()]}</div>
                      <div className="text-lg">{slots[0]?.datetime.getDate()}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Time Selection Card */}
            <div className="bg-gradient-to-br from-[#f5faf3] via-[#f5faf3] to-[#fff] rounded-2xl shadow-2xl p-5 sm:p-8 hover:shadow-2xl transition-all border border-[#dfe8d9] border-opacity-30 hover:border-opacity-60 backdrop-blur-lg group">
              {/* Glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#46a300] to-[#46a300] rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-300 pointer-events-none"></div>
              
              <div className="relative">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-[#1f2937] flex items-center gap-2 mb-1">
                    Select Time
                  </h3>
                  <p className="text-sm text-[#4b5563]">Pick a time slot that works for you</p>
                </div>

                {docSlots[slotIndex]?.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {docSlots[slotIndex]?.map((slot, i) => (
                      <button
                        key={i}
                        onClick={() => setSlotTime(slot.time)}
                        className={`py-3 px-2 rounded-lg font-medium text-sm transition-all duration-200 border ${
                          slot.time === slotTime
                            ? "bg-gradient-to-br from-[#46a300] to-[#46a300] text-white shadow-lg shadow-[#46a300]/30 scale-105 border-[#46a300] shadow-[0_0_20px_rgb(59_130_125_/_20%)]"
                            : "bg-[#f5faf3] text-[#1f2937] hover:bg-[#dfe8d9] border-[#dfe8d9] border-opacity-30 hover:border-opacity-60 hover:shadow-lg hover:shadow-[#46a300]/20"
                        }`}
                      >
                        {slot.time.toLowerCase()}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-[#fff] rounded-lg border border-[#dfe8d9] border-opacity-20">
                    <p className="text-[#4b5563]">No available slots for this date</p>
                  </div>
                )}
              </div>
            </div>

            {/* Appointment Summary */}
            {slotTime && (
              <div className="bg-gradient-to-br from-[#edf7e8] to-white border-2 border-[#46a300]/30 rounded-2xl p-6 space-y-4 shadow-[0_0_15px_rgb(59_130_125_/_12%)] shadow-lg shadow-[#46a300]/10 backdrop-blur-lg">
                <h4 className="font-bold text-[#46a300] flex items-center gap-2">
                  Appointment Details
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[#4b5563] font-medium">Doctor:</span>
                    <span className="text-[#1f1f1f] font-semibold">{docInfo.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#4b5563] font-medium">Date & Time:</span>
                    <span className="text-[#1f1f1f] font-semibold">
                      {daysOfWeek[docSlots[slotIndex]?.[0]?.datetime.getDay()]}, {docSlots[slotIndex]?.[0]?.datetime.getDate()} at {slotTime}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-[#46a300]/20">
                    <span className="text-[#4b5563] font-medium">Total Fee:</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-[#46a300] to-[#4b5563] bg-clip-text text-transparent">{currencySymbol}{docInfo.fees}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Book Button */}
            <button
              onClick={bookAppointment}
              disabled={!slotTime}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 relative group border ${
                slotTime
                  ? "bg-gradient-to-r from-[#46a300] to-[#46a300] text-white hover:shadow-2xl hover:shadow-[#46a300]/30 cursor-pointer border-[#46a300] shadow-[0_0_20px_rgb(59_130_125_/_20%)]"
                  : "bg-[#f5faf3] text-[#6b7280] cursor-not-allowed border-[#dfe8d9]"
              }`}
            >
              {!token ? "Login to Book Appointment" : slotTime ? "Confirm & Book Appointment" : "Select Date & Time"}
            </button>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-[#fff] bg-opacity-70 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-white via-[#f5faf3] to-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-[hero-enter_.3s_ease-out_both] border border-[#dfe8d9] border-opacity-60 shadow-[0_0_24px_rgb(24_52_63_/_12%)]">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[#46a300] via-[#46a300] to-[#4b5563] px-8 py-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-10 transition-opacity"></div>
                <h3 className="text-2xl font-bold text-white relative z-10">Confirm Your Appointment</h3>
                <p className="text-white/80 text-sm mt-1 relative z-10">Please review the details before confirming</p>
              </div>

              {/* Modal Content */}
              <div className="p-8 space-y-6">
                <div className="bg-gradient-to-br from-[#edf7e8] to-white rounded-xl p-6 space-y-4 border border-[#dfe8d9] border-opacity-60">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-[#4b5563] font-bold uppercase tracking-wide">Doctor</p>
                        <div className="mt-2">
                            <p className="font-semibold text-[#1f1f1f]">{docInfo.name}</p>
                            <p className="text-sm text-[#4b5563]">{docInfo.speciality}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-[#4b5563] font-bold uppercase tracking-wide">Speciality</p>
                        <p className="text-[#1f1f1f] font-semibold mt-1">{docInfo.speciality}</p>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-[#4b5563] font-bold uppercase tracking-wide">Appointment Date</p>
                        <p className="text-[#1f1f1f] font-semibold mt-1">
                          {selectedDate && `${selectedDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-[#4b5563] font-bold uppercase tracking-wide">Appointment Time</p>
                        <p className="text-[#1f1f1f] font-semibold mt-1">{slotTime}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fee Summary */}
                <div className="border-t-2 border-[#dfe8d9] border-opacity-30 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[#4b5563]">Consultation Fee:</span>
                    <span className="text-[#1f1f1f]">{currencySymbol}{docInfo.fees}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t-2 border-[#dfe8d9] border-opacity-30">
                    <span className="text-lg font-bold text-[#1f1f1f]">Total Amount:</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-[#46a300] to-[#4b5563] bg-clip-text text-transparent">{currencySymbol}{docInfo.fees}</span>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-amber-900 bg-opacity-30 border border-amber-600 border-opacity-50 rounded-lg p-4">
                  <p className="text-xs text-amber-200">
                    ℹ️ By confirming this appointment, you agree to our appointment policies and cancellation terms. You will receive a confirmation email shortly.
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-[#fff] px-8 py-4 flex gap-4 border-t border-[#dfe8d9] border-opacity-30">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-3 px-4 bg-[#f5faf3] text-[#1f2937] rounded-lg font-semibold hover:bg-[#dfe8d9] transition border border-[#dfe8d9] hover:border-[#dfe8d9]"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBooking}
                  disabled={isBooking}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold text-white transition-all border ${
                    isBooking
                      ? "bg-[#dfe8d9] cursor-not-allowed border-[#dfe8d9]"
                      : "bg-gradient-to-r from-[#46a300] to-[#46a300] hover:shadow-lg hover:shadow-[#46a300]/30 border-[#46a300] shadow-[0_0_20px_rgb(59_130_125_/_20%)]"
                  }`}
                >
                  {isBooking ? "Processing..." : "Confirm Appointment"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Related Doctors Section */}
        <div className="mt-16 border-t-2 border-[#dfe8d9] border-opacity-30 pt-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#1f1f1f] via-[#46a300] to-[#4b5563] bg-clip-text text-transparent mb-2">Recommended {docInfo.speciality} Specialists</h2>
            <p className="text-[#4b5563]">Other highly-rated doctors in the same specialization</p>
          </div>
          <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
        </div>
      </div>

    </div>
  );
};

export default Appointment;
