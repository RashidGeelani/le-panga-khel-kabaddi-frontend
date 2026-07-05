import { motion } from "framer-motion";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface Props{
message:string;
onRetry:()=>void;
}

export default function RegistrationError({
message,
onRetry
}:Props){

return(

<div className="min-h-screen flex items-center justify-center px-6">

<motion.div

initial={{opacity:0,y:30}}
animate={{opacity:1,y:0}}

className="max-w-lg w-full rounded-3xl bg-white/5 backdrop-blur-xl border border-red-500/20 p-10 text-center"

>

<AlertTriangle

size={80}

className="mx-auto text-red-400"

/>

<h2 className="text-4xl text-white font-bold mt-6">

Registration Failed

</h2>

<p className="text-red-300 mt-5">

{message}

</p>

<p className="text-white/50 mt-6">

If the issue persists,
please contact the tournament organizers.

</p>

<button

onClick={onRetry}

className="mt-10 bg-primary-color px-8 py-3 rounded-xl text-white"

>

<RotateCcw
size={18}
className="inline mr-2"
/>

Try Again

</button>

</motion.div>

</div>

)

}