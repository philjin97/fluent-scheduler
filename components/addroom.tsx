"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { Card } from "@/components/ui/card"; 
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AiOutlineLeft } from "react-icons/ai";

interface ScheduleModalProps {
  closeModal: () => void;
}

export default function AddRoom({ closeModal }: ScheduleModalProps) {
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState("");
  const [roomList, setRoomList] = useState([]);
  const [room, setRoom] = useState("");
  const [duration, setDuration] = useState("1");
  const [teacherName, setTeacherName] = useState("");
  const [studentName, setStudentName] = useState("");
  const [showScheduleTable, setShowScheduleTable] = useState(false); // 세 번째 세션
  const [showRoomSelection, setShowRoomSelection] = useState(false); // 방넘김

  const [selectedRoom, setSelectedRoom] = useState<string | null>(null); // 방 선택

  // Click on Search Available Rooms button to initiate this function.
  // This function sends date and time data to API and receives a list of rooms.
  async function searchRooms() {
    const formattedDate = date
      ? date.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
      : "";

    const all_rooms = await fetch(
      `http://43.201.252.152/schedules/search_rooms/${formattedDate}/${time}/`
    );
    const json_all_rooms = await all_rooms.json();

    console.log(json_all_rooms);
    setRoomList(json_all_rooms);
    setShowRoomSelection(true); // 상태 변경하여 다음 섹션으로 넘어가게 함
  }

  // 방 선택 핸들러
  function selectRoom(roomId: string) {
    setSelectedRoom(roomId); // 선택된 방 업데이트
    setRoom(roomId); // 선택된 방을 room 상태에 설정
  }

  // 뒤로가기 버튼 클릭 시 방 선택 섹션을 숨기고 첫 번째 섹션으로 돌아가기
  function goBackToDateTimeSelection() {
    setShowRoomSelection(false); // 첫 번째 섹션으로 돌아가기
  }

  async function saveClass() {
    setShowScheduleTable(true);

    const formattedDate = date
      ? date.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
      : "";

    const response = await fetch(`http://43.201.252.152/schedules/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        room_name: room,
        date: formattedDate,
        time: time,
        duration: duration,
        teacher_name: teacherName,
        student_name: studentName,
      }),
    });

    if (response.status == 200) {
      const currentSchedule = await fetch(
        `http://43.201.252.152/schedules/oneday_oneteacher/${formattedDate}/${teacherName}`
      );
      const data_currentSchedule = await currentSchedule.json();

      const allDivs = document.querySelectorAll(".scheduleTable");
      for (const div of allDivs) {
        div.innerHTML = "";
      }

      for (const each of data_currentSchedule) {
        const titleDiv = document.getElementById("title");
        const selectedDiv = document.getElementById(`${parseInt(each.time)}`);
        if (titleDiv)
          titleDiv.innerHTML = `${teacherName}'s Schedule for ${formattedDate}`;
        if (selectedDiv)
          selectedDiv.innerHTML = `${each.student_name} ${each.time_range}`;
      }
    }
  }

  return (
    <dialog id="my_modal_3" className="modal bg-slate-400 bg-opacity-50" open>
      <div className="flex flex-row relative">
        <div className="rounded-[3rem] p-5 bg-white">
          <Card className="w-[400px] h-[650px]  border-none">
           
            
       
            {/* <CardHeader>
              <CardTitle>Add Class</CardTitle>
            </CardHeader> */}

            {/* 첫 번째 섹션: 날짜 및 시간 선택 */}
            {!showRoomSelection && (
              <>
                <button
                type="button"
                onClick={closeModal}
                className="btn btn-sm btn-circle btn-ghost absolute top-6 right-6"
              >
                ✕
              </button>
                <div className="dot flex mx-5 mt-10 space-x-2">
                  <div className="w-[30px] h-[12px] bg-[#121B5C] rounded-full"></div>
                  <div className="w-[12px] h-[12px] bg-[#D9D9D9] rounded-full"></div>
                  <div className="w-[12px] h-[12px] bg-[#D9D9D9] rounded-full"></div>
                </div>

                <div className="flex flex-col items-center  justify-center m">
                  <DayPicker mode="single" selected={date} onSelect={setDate} />
                </div>
                <div className="flex flex-col items-start text-left px-16 py-5">
                  <p className="text-lg font-semibold">When is your class?</p>
                  <p className="mt-3 text-md">
                    {date ? `${date.toLocaleDateString()}` : "Select a date"}
                  </p>
                </div>

                <div className="flex flex-col  items-start text-left space-y-2  px-16 py-5">
                  <p className="time text-lg font-semibold">
                    What time is your class?
                  </p>
                  <Input
                    id="time"
                    type="number"
                    placeholder="Enter time (24-hour format)"
                    value={time}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);

                      if (value >= 0 && value <= 23) {
                        setTime(e.target.value);
                      } else if (e.target.value === "") {
                        setTime("");
                      }
                    }}
                    className="w-2/3 text-start"
                    min={0}
                    max={23}
                  />
                </div>
                <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 mb-5 w-full flex justify-center">
                  <button
                    onClick={searchRooms}
                    className={` w-4/5 h-14 mt-6 rounded-xl text-white ${
                      date && time
                        ? "bg-[#121B5C]"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Search Available Rooms
                  </button>
                </div>
              </>
            )}

            {/* 두 번째 섹션: 방 선택 및 수업 정보 입력 */}
            {showRoomSelection && (
              <>
                <button
                  onClick={goBackToDateTimeSelection}
                  className="absolute top-4 left-5  text-gray-400"
                >
                  <AiOutlineLeft className="text-semibold w-6 h-6" />
                </button>
                <button
                type="button"
                onClick={closeModal}
                className="btn btn-sm btn-circle btn-ghost absolute top-6 right-6"
              >
                ✕
              </button>
                <div className="dot flex mx-5 mt-10 space-x-2">
                  <div className="w-[12px] h-[12px] bg-[#D9D9D9] rounded-full"></div>
                  <div className="w-[30px] h-[12px] bg-[#121B5C] rounded-full"></div>
                  <div className="w-[12px] h-[12px] bg-[#D9D9D9] rounded-full"></div>
                </div>
                <div className="flex flex-col ml-[1rem]">
                  <p className="mt-5 text-3xl font-semibold">
                    {date ? `${date.toLocaleDateString()}` : "Select a date"}
                  </p>

                  <p className="my-5 w-20 h-10 text-xl font-semibold rounded-[20px] text-white bg-[#075AFF] flex items-center justify-center">
                    {time ? `${time}:00` : "time error"}
                  </p>
                </div>

                <div className="flex flex-col justify-start mb-4  w-11/12 mx-auto">
                  {roomList.map((room_name, index) => (
                    <div
                      key={index}
                      onClick={() => selectRoom(room_name)}
                      className={`p-5 mb-2 rounded-[20px] w-full h-12 font-bold text-black  cursor-pointer border-[1px] border-[#075AFF] flex items-center justify-start
        ${
          selectedRoom === room_name
            ? "bg-[#075AFF] text-white" // 선택된 방일 경우 유지
            : "bg-white text-black hover:bg-[#075AFF] hover:text-white"
        } transition-all`}
                    >
                      {room_name}호
                    </div>
                  ))}
                </div>
                {room && (
                  <>
                    {/* <div>
                        <div className="text-sm">Room</div>
                        <h5>{room}</h5>
                      </div> */}
                    <div className="space-y-2 mb-3  w-11/12 mx-auto ">
                      <p className="text-lg font-semibold">Duration</p>
                      <Select value={duration} onValueChange={setDuration}>
                        <SelectTrigger id="duration">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 hour</SelectItem>
                          <SelectItem value="2">2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex">
                      <div>
                        {" "}
                        <Input
                          id="teacher-name"
                          placeholder="Teacher"
                          value={teacherName}
                          onChange={(e) => setTeacherName(e.target.value)}
                          className=" ml-5 border-none focus:outline-none focus:ring-0"
                        />
                        <div className="flex ml-5 w-40 border-[1px] border-[#075AFF]"></div>
                      </div>
                      <div>
                        {" "}
                        <Input
                          id="student-name"
                          placeholder="Student"
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          className=" ml-5 border-none focus:outline-none focus:ring-0"
                        />
                        <div className="flex ml-5 w-40 border-[1px] border-[#075AFF]"></div>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-center">
                  {" "}
                  <button
                    onClick={saveClass}
                    className={` w-4/5 h-14 mt-6 rounded-xl text-white ${
                      teacherName && studentName && duration && room
                        ? "bg-[#121B5C]"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Add Class
                  </button>
                </div>
              </>
            )}
          </Card>
        </div>

        {/* 세 번째 섹션: 시간표 표시 */}
        {showScheduleTable && (
          <div className="bg-white border-2 border-slate-500 rounded-3xl p-5 w-[350px] flex flex-col">
            <div id="title" className="text-xl font-bold"></div>
            {[...Array(12)].map((_, index) => (
              <div
                key={index + 12}
                id={`${index + 12}`}
                className="border-2 border-black h-[10%] text-center font-bold scheduleTable"
              ></div>
            ))}
              <div className="flex justify-center mt-4">
      <button
        onClick={() => window.location.reload()} // 새로고침 기능
        className="w-4/5 h-14 rounded-xl text-white bg-[#121B5C]"
      >
       close
      </button>
    </div>
          </div>
        )}
      </div>
    </dialog>
  );
}
