const Administrationhome = Vue.component("administrationhome", {
    template:  
    `
    <div class="main-container pb-5">
    <div class="container">
   <div class="row">
      <div class="col-lg-8 offset-lg-2">
         <!-- Welcome Message -->
         <div class="jumbotron pt-3 pb-3">
            <h1 class="display-4 greeting">Welcome, {{username}}!</h1>
            <p class="scope">You can Add, delete, edit Class Rooms and Slots</p>
            <button type="button" class="add-course-btn" data-bs-toggle="modal" data-bs-target="#addRoomModal">
            Add Room
            <i class="fa fa-plus" aria-hidden="true"></i>
            </button>
         </div>
         <div class="alert alert-danger" v-if="error">
            {{ error }}
            </div>

            <div class="mt-4">
                        <div v-if="rooms.length === 0">
                            <h2>No Class Rooms Available</h2>
                        </div>
                        <div v-else>
                            <h2>Class Rooms</h2>
                            <ul class="list-group">
                                <li class="list-group-item" v-for="room in rooms" :key="room.id">
                                    <h5>{{ room.name }}</h5>
                                    <p class="mb-1">{{ room.description }}
                                    </p>
                                    <div class="btn-group" role="group">
                                        <button type="button" class="btn btn-sm btn-outline-secondary" :data-bs-target="'#editModal' + room.id" data-bs-toggle="modal">
                                        Edit
                                        </button>
                                        <button type="button" class="btn btn-sm btn-outline-danger" @click="deleteroom(room.id)">
                                        Delete
                                        </button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
            </div> 
         </div> 
      </div> 

        <div class="container mt-3">
            <div class="row">
                <div class="col-lg-8 offset-lg-2">
                <button type="button" class="add-course-btn" data-bs-toggle="modal" data-bs-target="#addSlotModal">
                Add Slot
                <i class="fa fa-plus add-icon" aria-hidden="true"></i>
                </button>
                <div class="alert alert-danger" v-if="error">
                    {{ error }}
                </div>
                    <div class="mt-4">
                        <div v-if="classroomslots.length === 0">
                            <h2>No Classroom Slots Available</h2>
                        </div>
                        <div v-else>
                            <h2>Classroom Slots</h2>
                            <ul class="list-group">
                                <li class="list-group-item" v-for="slot in upcomingClassroomSlots" :key="slot.id">
                                    <h5>{{ formatScheduleDate(slot.day) }}</h5>
                                    <p class="mb-1">
                                        <i class="fas fa-clock fa-lg text-center" style="font-size: 1.0rem"></i>
                                        {{ slot.start_time }}
                                        <span class="mx-1">To</span>
                                        {{ slot.end_time }}
                                    </p>
                                    <div class="btn-group" role="group">
                                        <button type="button" class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal" :data-bs-target="'#editSlotModal' + slot.id">
                                        Edit
                                        </button>
                                        <button type="button" class="btn btn-sm btn-outline-danger" @click="deleteclassroomslot(slot.id)">
                                        Delete
                                        </button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    <div class="modal fade" id="addSlotModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addSlotModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="addSlotModalLabel">Add Slot</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="my-3">
                        <label for="scheduleDate">Select Day</label>
                        <input v-model="scheduleDate" type="date" id="scheduleDate" class="form-control">
                    </div>
                    <div class="my-3">
                        <label for="startTime">Start Time</label>
                        <input v-model="startTime" type="time" id="startTime" class="form-control">
                    </div>
                    <div class="my-3">
                        <label for="endTime">End Time</label>
                        <input v-model="endTime" type="time" id="endTime" class="form-control">
                    </div>
                </div>
                <div class="modal-footer">

                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" @click="addclassroomslot" class="btn btn-primary" data-bs-dismiss="modal">Submit</button>
                </div>
            </div>
        </div>
    </div>

    <div v-for="slot in classroomslots" :key="slot.id" class="modal fade" :id="'editSlotModal' + slot.id" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" :aria-labelledby="'editSlotModalLabel' + slot.id" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" :id="'editSlotModalLabel' + slot.id">Edit Slot</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="my-3">
                        <label for="scheduleDate">Edit Day</label>
                        <input v-model="slot.day" type="date" id="scheduleDate" class="form-control">
                    </div>
                    <div class="my-3">
                        <label for="startTime">Edit Start Time</label>
                        <input v-model="slot.start_time" type="time" id="startTime" class="form-control">
                    </div>
                    <div class="my-3">
                        <label for="endTime">Edit End Time</label>
                        <input v-model="slot.end_time" type="time" id="endTime" class="form-control">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" @click="editclassroomslot(slot)" class="btn btn-primary" data-bs-dismiss="modal">Submit</button>
                </div>
            </div>
        </div>
    </div>







      <div class="modal fade" id="addRoomModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addRoomModalLabel" aria-hidden="true">
      <div class="modal-dialog">
         <div class="modal-content">
            <div class="modal-header">
               <h1 class="modal-title fs-5" id="addRoomModalLabel">Add Course</h1>
               <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
               <div class="my-3">
                  <label for="roomname">Enter Course Name</label>
                  <input v-model="roomname" type="text" id="roomname" class="form-control" placeholder="Room Name">
               </div>
               <div class="my-3">
                  <label for="room_description">Enter Room Description</label>
                  <textarea v-model="room_description" class="form-control"></textarea>
               </div>
            </div>
            <div class="modal-footer">
               <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
               <button type="button" @click="addroom" class="btn btn-primary" data-bs-dismiss="modal">Submit</button>
            </div>
         </div>
      </div>
   </div>

    <div v-for="room in rooms" :key="room.id" class="modal fade" :id="'editModal' + room.id" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" :aria-labelledby="'editModalLabel' + room.id" aria-hidden="true">
    <div class="modal-dialog">
         <div class="modal-content">
            <div class="modal-header">
               <h1 class="modal-title fs-5" :id="'editModal' + room.id">Edit Room</h1>
               <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
               <div class="my-3">
                  <label for="roomname">Edit Room Name</label>
                  <input v-model="room.name" type="text" id="roomname" class="form-control" placeholder="Room Name">
               </div>
               <div class="my-3">
                  <label for="room_description">Edit Room Description</label>
                  <textarea v-model="room.description" class="form-control"></textarea>
               </div>
            </div>
            <div class="modal-footer">
               <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
               <button type="button" @click="editroom(room)" class="btn btn-primary" data-bs-dismiss="modal">Submit</button>
            </div>
         </div>
      </div>
      </div> 
    
    `,

    data() {
        return {
          rooms: [],
          roomname: null,
          room_description: null,
          error: null,
          userRole: localStorage.getItem("role"),
          token: localStorage.getItem("auth-token"),
          username: localStorage.getItem("username"),
          scheduleDate: null,
          startTime: null,
          endTime: null,
          classroomslots: [],
        };
      },

      methods: {
        async getrooms() {
            const res = await fetch("/class-room", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authentication-Token": this.token,
                "Authentication-Role": this.userRole,
              },
            });
            if (res.ok) {
              const data = await res.json();
              console.log(data);
              this.rooms = data;
            } else {
              const data = await res.json();
              console.log(data);
              this.error = data.error_message;
            }
          },
            async addroom() {
                const res = await fetch("/class-room", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": this.token,
                    "Authentication-Role": this.userRole,
                },
                body: JSON.stringify({
                    roomname: this.roomname,
                    room_description: this.room_description,
                }),
                });
                if (res.ok) {
                const data = await res.json();
                this.getrooms();
                } else {
                const data = await res.json();
                console.log(data);
                alert(data.error_message);
                }
            },

            async deleteroom(id) {
                const res = await fetch("/class-room/" + id
                , {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-Token": this.token,
                        "Authentication-Role": this.userRole,
                    },
                });
                if (res.ok) {
                    this.getrooms();
                } else {
                    const data = await res.json();
                    console.log(data);
                    this.error = data.error_message;
                }
            },

            async editroom(room) {
                const res = await fetch("/class-room/" + room.id, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-Token": this.token,
                        "Authentication-Role": this.userRole,
                    },
                    body: JSON.stringify({
                        roomname: room.name,
                        room_description: room.description,
                    }),
                });
                if (res.ok) {
                    const data = await res.json();
                    this.getrooms();
                } else {
                    const data = await res.json();
                    console.log(data);
                    this.error = data.error_message;
                }
            },

        async getclassroomslots() {
            const res = await fetch("/class-room-slots",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": this.token,
                    "Authentication-Role": this.userRole,
                },
            });
            if (res.ok) {
                const data = await res.json();
                console.log(data);
                this.classroomslots = data;
            } else {
                const data = await res.json();
                console.log(data);
                this.error = data.error_message;
            }
        },

        async addclassroomslot() {
            const res = await fetch("/class-room-slots",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": this.token,
                    "Authentication-Role": this.userRole,
                },
                body: JSON.stringify({
                    day: this.scheduleDate,
                    start_time: this.startTime,
                    end_time: this.endTime,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                this.getclassroomslots();
            } else {
                const data = await res.json();
                console.log(data);
                this.error = data.error_message;
            }

        },

        async deleteclassroomslot(id) {
            const res = await fetch("/class-room-slots/" + id,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": this.token,
                    "Authentication-Role": this.userRole,
                },
            });
            if (res.ok) {
                this.getclassroomslots();
            } else {
                const data = await res.json();
                console.log(data);
                this.error = data.error_message;
            }

        },
        async editclassroomslot(slot) {
            const res = await fetch("/class-room-slots/" + slot.id,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": this.token,
                    "Authentication-Role": this.userRole,
                },
                body: JSON.stringify({
                    day: slot.day,
                    start_time: slot.start_time,
                    end_time: slot.end_time,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                this.getclassroomslots();
            } else {
                const data = await res.json();
                console.log(data);
                this.error = data.error_message;
            }

        },

        formatScheduleDate(dateString) {
            // Convert the date string to a Date object
            const date = new Date(dateString);
      
            // Get day name
            const days = [
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ];
            const dayName = days[date.getDay()];
      
            // Format the date as "dd-mm-yyyy"
            const formattedDate = `${date.getDate().toString().padStart(2, "0")}-${(
              date.getMonth() + 1
            )
              .toString()
              .padStart(2, "0")}-${date.getFullYear()}`;
      
            // Return the formatted date with day name
            return `${formattedDate} (${dayName})`;
          },







        },

        computed: {
            upcomingClassroomSlots() {
                const currentDate = new Date();
                return this.classroomslots.filter(slot => {
                    const slotDate = new Date(slot.day);
                    const endTime = new Date(`${slot.day} ${slot.end_time}`);
                    return slotDate >= currentDate || endTime >= currentDate;
                });
            }
        },

        mounted() {
            this.getrooms();
            this.getclassroomslots();
            document.title = "Administration Home";
        },




});

export default Administrationhome;
