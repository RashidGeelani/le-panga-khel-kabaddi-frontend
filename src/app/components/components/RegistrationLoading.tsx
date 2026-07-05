import { motion } from "framer-motion";
import { Trophy, LoaderCircle } from "lucide-react";

export default function RegistrationLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: .9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 text-center shadow-2xl"
      >
        <motion.div
          animate={{
            rotate: [0, -10, 10, -10, 0],
            scale: [1, 1.08, 1]
          }}
          transition={{
            repeat: Infinity,
            duration: 2
          }}
          className="mx-auto mb-8"
        >
          <Trophy
            className="mx-auto text-yellow-400"
            size={72}
          />
        </motion.div>

        <h2 className="text-3xl font-bold text-white">
          Registering Team
        </h2>

        <p className="text-white/60 mt-3">
          Please wait while we securely process your registration.
        </p>

        <div className="mt-10 space-y-4">

          <Step text="Validating Details" done />

          <Step text="Uploading Team Logo" done />

          <Step text="Uploading Payment Proof" done />

          <Step text="Saving Registration" loading />

        </div>

        <LoaderCircle
          className="animate-spin text-primary-color mx-auto mt-8"
          size={28}
        />
      </motion.div>
    </div>
  );
}

function Step({
  text,
  done,
  loading
}:{
  text:string;
  done?:boolean;
  loading?:boolean;
}){

  return(
    <div className="flex justify-between items-center text-white/70">

      <span>{text}</span>

      {done && (
        <span className="text-green-400">
          ✓
        </span>
      )}

      {loading && (
        <LoaderCircle
          size={18}
          className="animate-spin text-primary-color"
        />
      )}

    </div>
  )
}