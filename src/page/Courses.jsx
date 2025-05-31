"use client"

import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import useAuth from "../hook/useAuth"
import { Calendar, Clock, DollarSign, User, ArrowRight } from "lucide-react"

const Courses = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("")
  const [order, setOrder] = useState("asc")

  const { data: tutors = [], isLoading } = useQuery({
    queryKey: ["tutors", search, sortBy, order],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://study-hive-server-three.vercel.app/tutor?search=${search}&sortBy=${sortBy}&order=${order}`,
      )
      return data
    },
  })

  const handleReadMore = (sessionId) => {
    navigate(`/sessionDetail/${sessionId}`)
  }

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="my-12 max-w-7xl mx-auto px-4">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold">
          Available <span className="text-blue-500">Courses</span>
        </h2>
        <div className="w-24 h-1 bg-blue-500 mx-auto mt-2 rounded-full"></div>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Explore our wide range of courses taught by expert tutors to enhance your skills and knowledge.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
        <div className="flex w-full md:w-auto overflow-hidden border-2 rounded-lg focus-within:border-blue-500 transition-colors">
          <input
            className="w-full px-6 py-3 text-gray-700 bg-white outline-none"
            type="text"
            name="search"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            placeholder="Search courses..."
            aria-label="Search courses"
          />

          <button className="px-4 py-3 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors">
            Search
          </button>
        </div>

        <div className="w-full md:w-auto">
          <select
            className="w-full md:w-auto border-2 p-3 rounded-lg bg-white cursor-pointer focus:border-blue-500 outline-none transition-colors text-black"
            defaultValue=""
            onChange={(e) => {
              const [field, orderValue] = e.target.value.split("-")
              setSortBy(field)
              setOrder(orderValue)
            }}
          >
            <option value="" disabled>
              Sort by Price
            </option>
            <option value="registrationFee-desc">Highest Price</option>
            <option value="registrationFee-asc">Lowest Price</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="relative w-20 h-20">
            <div className="absolute top-0 left-0 w-full h-full border-8 border-blue-200 rounded-full animate-ping opacity-75"></div>
            <div className="absolute top-0 left-0 w-full h-full border-8 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {tutors
            .filter((session) => session.status === "Approved")
            .map((session, i) => {
              const currentDate = new Date()
              const registrationStartDate = new Date(session.registrationStartDate)
              const registrationEndDate = new Date(session.registrationEndDate)
              const isRegistrationOngoing = currentDate >= registrationStartDate && currentDate <= registrationEndDate

              return (
                <div
                  key={i}
                  className="group  rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      src={session.sessionImage || "/placeholder.svg?height=200&width=400"}
                      alt={session.sessionTitle}
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=200&width=400"
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-xl font-bold text-white line-clamp-1">{session.sessionTitle}</h3>
                    </div>

                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          isRegistrationOngoing ? "bg-green-500 text-white" : "bg-red-500 text-white"
                        }`}
                      >
                        {isRegistrationOngoing ? "Registration Open" : "Registration Closed"}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center mb-3 text-gray-500">
                      <User size={16} className="mr-2" />
                      <span className="text-sm">{session.name}</span>
                    </div>

                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{session.sessionDescription}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-500 text-xs">
                        <Calendar size={14} className="mr-2" />
                        <span>
                          Registration: {formatDate(session.registrationStartDate)} -{" "}
                          {formatDate(session.registrationEndDate)}
                        </span>
                      </div>

                      <div className="flex items-center text-gray-500 text-xs">
                        <Clock size={14} className="mr-2" />
                        <span>Duration: {session.sessionDuration || "2"} hours</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center text-blue-600 font-semibold">
                        <DollarSign size={16} className="mr-1" />
                        <span>{session.registrationFee > 0 ? `${session.registrationFee}` : "Free"}</span>
                      </div>

                      <button
                        onClick={() => handleReadMore(session._id)}
                        className="flex items-center text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors group-hover:shadow-md"
                      >
                        <span>Details</span>
                        <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      )}

      {tutors.filter((session) => session.status === "Approved").length === 0 && !isLoading && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium text-gray-600">No courses found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  )
}

export default Courses
