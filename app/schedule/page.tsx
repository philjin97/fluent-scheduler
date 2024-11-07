"use client";

import EnterButton from "../../components/EnterButton/EnterButton";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import ToastUI from "../../components/ToastUI/ToastUI";
import "react-day-picker/dist/style.css";
import AddRoom from "@/components/addroom";

export default function Page() {
  const [room_name, setRoomName] = useState(""); // room_name 상태 추가
  const [time, setTime] = useState(0); // 시간 상태 추가
  const [duration, setDuration] = useState(1); // 기본 지속 시간 1시간
  const [teacher_name, setTeacherName] = useState(""); // teacher_name 상태 추가
  const [student_name, setStudentName] = useState(""); // student_name 상태 추가
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const URL = "http://43.201.252.152/schedules/";
  const [classes, setClasses] = useState<any[]>([]); // classes의 타입 정의

  useEffect(() => {
    fetch(URL)
      .then((res) => res.json())
      .then((data) => {
        console.log("data 은? ", data);
        setClasses(data);
      });
  }, []);

  const content = {
    submit: "submit",
    edit: "click Edit",
  };

  const [selected, setSelected] = useState<Date>(new Date());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 선택된 날짜 포맷
    const formattedDate = selected
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      })
      .replace(/\./g, "."); // 2024. 9. 17 형식
    // 시간 설정
    const startDateTime = new Date(selected);
    startDateTime.setHours(time);

    // duration에 따라 종료 시간 설정
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(startDateTime.getHours() + duration);

    // UTC로 변환
    const startUTC = new Date(
      startDateTime.getTime() + startDateTime.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, -5);
    const endUTC = new Date(
      endDateTime.getTime() + endDateTime.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, -5);
    // 지속 시간을 설정
    const durationValue = duration === 1 ? 1 : 2; // 1시간 또는 2시간 선택

    await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        calendarId: "cal1",
        room_name,
        date: formattedDate, // 날짜 추가
        time,
        duration: durationValue,
        teacher_name,
        student_name,
      }),
    })
      .then((res) => {
        if (res.ok) {
          alert("완료되었습니다!");

          window.location.reload();
        } else {
          console.error("Submit failed");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="flex bg-gradient-to-b from-[#3f4166] to-[#292956]">
      <div className="flex-col bg-white w-1/8 min-h-screen">
        <div className="flex m-5 mb-14 justify-center">
          <Link href="/" className="btn btn-ghost text-xl font-['Playwrite']">
            Fluent
          </Link>
        </div>

        <div className="h-fit" onClick={openModal}>
          <p className="px-5 my-8 text-gray-400 text-sm font-semibold">
            달력관리
          </p>
          <EnterButton id="edit" content={content} />
        </div>
      </div>

      <div className="flex-1 flex justify-center items-center max-w-full max-h-full overflow-auto">
        <div className="bg-white w-[95%] h-[90%] max-w-full m-5 p-5 rounded-lg shadow-lg overflow-hidden">
          <ToastUI data={classes} />
        </div>
      </div>

      {isModalOpen && (
        <AddRoom closeModal={closeModal} />
      )}
    </div>
  );
}
