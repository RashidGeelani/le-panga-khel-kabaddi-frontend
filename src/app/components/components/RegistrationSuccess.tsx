import { motion } from "framer-motion";
import {
  CheckCircle2,
  Trophy,
  Home,
  RotateCcw
} from "lucide-react";

interface Props{
  registrationId:string;
  teamName:string;
  captainName:string;
  district:string;

  onRegisterAnother:()=>void;
}

export default function RegistrationSuccess({

  registrationId,
  teamName,
  captainName,
  district,
  onRegisterAnother

}:Props){

  return(

<div className="min-h-screen flex items-center justify-center px-6">

<motion.div

initial={{opacity:0,y:30}}
animate={{opacity:1,y:0}}

className="max-w-xl w-full rounded-3xl bg-white/5 backdrop-blur-xl border border-green-500/20 p-10 text-center shadow-2xl"

>

<motion.div

initial={{scale:0}}
animate={{scale:1}}

transition={{
type:"spring",
stiffness:180
}}

>

<CheckCircle2

size={90}

className="mx-auto text-green-400"

/>

</motion.div>

<h1 className="text-4xl font-bold text-white mt-6">

Registration Successful

</h1>

<p className="text-white/60 mt-3">

Your team has been successfully registered.

</p>

<div className="mt-8 rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4 text-left">

<Item label="Registration ID" value={registrationId}/>

<Item label="Team" value={teamName}/>

<Item label="Captain" value={captainName}/>

<Item label="District" value={district}/>

<Item
label="Status"
value="Pending Verification"
/>

</div>

<div className="mt-8 bg-green-500/10 border border-green-500/20 rounded-2xl p-5">

<div className="flex gap-3">

<Trophy className="text-green-400"/>

<p className="text-white/70 text-sm">

Your confirmation email has been sent.
Our committee will verify your payment
and contact you shortly.

</p>

</div>

</div>

<div className="grid grid-cols-2 gap-4 mt-10">

<button

onClick={onRegisterAnother}

className="rounded-xl py-3 bg-primary-color text-white font-semibold"

>

<RotateCcw className="inline mr-2" size={18}/>

Register Another

</button>

<button

onClick={()=>window.location.href="/"}

className="rounded-xl py-3 border border-white/10 text-white"

>

<Home className="inline mr-2" size={18}/>

Home

</button>

</div>

</motion.div>

</div>

)

}

function Item({
label,
value
}:{
label:string;
value:string;
}){

return(

<div className="flex justify-between">

<span className="text-white/40">

{label}

</span>

<span className="text-white font-semibold">

{value}

</span>

</div>

)

}