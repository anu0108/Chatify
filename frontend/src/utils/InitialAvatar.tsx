const InitialAvatar = ({ name, className = "w-10 h-10 text-sm bg-gradient-to-br from-blue-500 to-purple-500" }: { name: string; className?: string }) => (
    <div className={`${className} rounded-full  flex items-center justify-center text-white font-bold flex-shrink-0`}>
        {name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
    </div>
);

export default InitialAvatar;