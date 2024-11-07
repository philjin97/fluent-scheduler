"use client";

import { useEffect, useRef, useState } from "react";
import Calendar from "@toast-ui/calendar";
import "@toast-ui/calendar/dist/toastui-calendar.min.css";

interface ToastUIProps {
  data: {
    id: string;
    calendarId: string;
    room_name: string;
    date: string | undefined;
    time: number;
    duration: number;
    teacher_name: string;
    student_name: string;
  }[];
}

const ToastUI: React.FC<ToastUIProps> = ({ data }) => {
  const calendarContainerRef = useRef<HTMLDivElement>(null);
  const calendarInstanceRef = useRef<Calendar | null>(null);
  const [scheduleData, setScheduleData] = useState([]);

  //시간췌크

  const [currentDate, setCurrentDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });
  function formatTime(time: Date) {
    const hours = `${time.getHours()}`.padStart(2, "0");
    const minutes = `${time.getMinutes()}`.padStart(2, "0");
    return `${hours}:${minutes}`;
  }
  useEffect(() => {
    const formattedData = data
      .map((event) => {
        // date와 time이 존재하는지, 그리고 유효한 형식인지 확인
        if (!event.date || isNaN(event.time) || isNaN(event.duration))
          return null;

        const [year, month, day] = event.date.split(". ").map(Number);

        // 날짜 형식이 올바르지 않으면 제외
        if (!year || !month || !day) return null;

        // 이벤트 시작 시간과 종료 시간 계산
        const start = new Date(year, month - 1, day, event.time, 0, 0);
        const end = new Date(start.getTime() + event.duration * 60 * 60 * 1000);

        // 유효하지 않은 날짜 값은 제외
        if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

        return {
          id: event.id,
          calendarId: event.calendarId,
          title: `${event.room_name}호 ${event.teacher_name} 선생님`,
          category: "time",
          start,
          end,
          raw: {
            room_name: event.room_name,
            teacher_name: event.teacher_name,
            student_name: event.student_name,
          },
        };
      })
      .filter((event) => event !== null); // 유효한 이벤트만 남기기

    setScheduleData(formattedData);
  }, [data]);

  useEffect(() => {
    if (calendarContainerRef.current && !calendarInstanceRef.current) {
      calendarInstanceRef.current = new Calendar(calendarContainerRef.current, {
        defaultView: "month",
        useDetailPopup: true,
        timezone: {
          zones: [
            {
              timezoneName: "Asia/Seoul",
              displayLabel: "Seoul",
            },
          ],
        },

        usageStatistics: false,
      });
    }

    if (calendarInstanceRef.current && scheduleData.length > 0) {
      calendarInstanceRef.current.clear(); // 기존 이벤트 제거
      calendarInstanceRef.current.createEvents(scheduleData); // 새로운 이벤트 추가
    }

    calendarInstanceRef.current.setCalendars([
      {
        id: "cal1",
        name: "수업",
        backgroundColor: "#9e5fff",
        dragBackgroundColor: "#d9c0ff",
        borderColor: "#ff23ff",
      },
    ]);

    // setOptions 호출 추가
    calendarInstanceRef.current.setOptions({
      useFormPopup: false,
      useDetailPopup: false,
      isReadOnly: true,
      gridSelection: false,
      // template: {
      //   time(event) {
      //     const { color, raw } = event;
      //     return `<span style="color: ${color};">
      //     ${raw.time}시 - ${raw.room_name}호 ${raw.duration}시간
      //     ${raw.teacher_name} 썜
      //    ${raw.student_name} 학생 </span>`;
      //   },
      //   allday(event) {
      //     return `<span style="color: gray;">${event.title}</span>`;
      //   },
      // },
      month: {
        isAlways6Weeks: false, // 다음달 한주까지 보이게 할지말지
      },
    });

    // 기본 테마 설정
    calendarInstanceRef.current.setTheme({
      common: {
        border: "1px dotted #e5e5e5",

        today: {
          color: "white",
          backgroundColor: "#3f4166",
        },
        saturday: {
          color: "rgba(64, 64, 255)",
        },
        gridSelection: {
          backgroundColor: "rgba(81, 230, 92, 0.05)",
          border: "1px dotted #ff0000",
        },
      },
      month: {
        weekend: {
          backgroundColor: "aliceblue",
        },
        holidayExceptThisMonth: {
          color: "red",
        },
        dayName: {
          border: "20px",
          backgroundColor: "none",
        },
        moreView: {
          border: "1px solid #3f4166",
          borderRadius: "1rem",
          boxShadow: "0 2px 6px 0 grey",
          backgroundColor: "white",
          width: 320,
          height: 200,
        },
      },
    });

    // clickEvent 이벤트 리스너 추가
    calendarInstanceRef.current.on("clickEvent", ({ event }) => {
      const el = document.getElementById("clicked-event");
      if (el) {
        el.innerText = event.title; // 클릭한 이벤트의 제목 표시
      }
    });

    // 현재 표시 중인 연도와 월 업데이트
    calendarInstanceRef.current.on("afterRender", () => {
      const date = calendarInstanceRef.current?.getDate();
      if (date) {
        setCurrentDate({
          year: date.getFullYear(),
          month: date.getMonth() + 1,
        });
      }
    });
  }, [scheduleData]);

  const updateCurrentDate = () => {
    const date = calendarInstanceRef.current?.getDate();
    if (date) {
      setCurrentDate({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
      });
    }
  };

  // today 버튼 클릭 핸들러
  const handleTodayClick = () => {
    calendarInstanceRef.current?.today();
    updateCurrentDate();
  };

  const handlePrevClick = () => {
    calendarInstanceRef.current?.prev();
    updateCurrentDate();
  };

  const handleNextClick = () => {
    calendarInstanceRef.current?.next();
    updateCurrentDate();
  };

  // 랜덤 색상 생성 함수
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  // 캘린더 색상 변경 핸들러
  const handleChangeColor = () => {
    const randomColor = getRandomColor();
    const randomBorderColor = getRandomColor();
    calendarInstanceRef.current?.setCalendarColor("cal1", {
      backgroundColor: randomColor, // 새로운 배경색
      dragBackgroundColor: randomColor, // 드래그 배경색
      borderColor: randomBorderColor, // 테두리 색상
    });
  };
  return (
    <div>
      <div className="flex items-center mb-5">
        <button
          onClick={handlePrevClick}
          className="p-1 px-3  border-2 rounded-[100%] hover:bg-slate-500 hover:text-white"
        >
          ←
        </button>

        <div className="text-xl mx-8">
          {currentDate.year}. {currentDate.month}
        </div>

        <button
          onClick={handleNextClick}
          className=" p-1 px-3  border-2 rounded-[100%] hover:bg-slate-500 hover:text-white"
        >
          →
        </button>

        <button
          onClick={handleTodayClick}
          className="ml-5 p-1 px-3  border-2 rounded-2xl  hover:bg-slate-500 hover:text-white"
        >
          Today
        </button>
      </div>

      <div>
        {" "}
        {/* <button
          onClick={handleChangeColor}
          className="mb-3 border-2 hover:bg-slate-500 hover:text-white"
        >
          Change Calendar Color
        </button> */}
      </div>

      <div
        ref={calendarContainerRef}
        style={{ width: "100%", height: "80vh" }}
      />
    </div>
  );
};

export default ToastUI;
