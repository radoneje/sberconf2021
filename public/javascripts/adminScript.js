window.onload=function () {
    var app = new Vue({
        el: '#app',
        data: {
            newDay:"",
            conferenceDays:[],
            activeDay:null,
            newSession:"",
            sessions:[]
        },
        methods:{
            addDay:async function(){
                this.conferenceDays= (await axios.post("/conf/day",{key:this.newDay}) ).data;
                this.newDay="";

            },
            addSession:async function(){
                this.sessions= (await axios.post("/conf/session",{key:this.newSession, id:this.activeDay.id}) ).data;
                this.newSession="";

            },
            sessionChange: async function(event,item) {
                item.status=event.target.value;
                await axios.post("/conf/sessionChange/", {item:item});
            },
            sessionDelete:async function(item){
                await axios.delete("/conf/session/"+ item.id);
                this.sessions=this.sessions.filter(e=>e.id!=item.id);
            },
            copyText:async function(text){
                console.log(text);
            },
            uploadFile:async function(item){

            },
        },
        watch:{
            activeDay:async function () {
                this.sessions=[];
                this.sessions=(await axios.get("/conf/session/"+this.activeDay.id)).data;
                console.log(this.sessions);
            }
        },
        mounted:async function () {
            this.conferenceDays= (await axios.get("/conf/day")).data;
            console.log(this.conferenceDays);
        }
    })
}