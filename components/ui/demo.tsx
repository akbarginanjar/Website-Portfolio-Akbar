import { InteractiveTravelCard } from "@/components/ui/3d-card";

export default function InteractiveTravelCardDemo() {
  return (
    // The container uses theme variables and provides perspective for the 3D effect.
    <div className="flex min-h-[30rem] w-full items-center justify-center bg-background p-8">
       <div 
        style={{
          perspective: "1000px"
        }}
       >
        <InteractiveTravelCard
          title="AKBAR GINANJAR"
          subtitle="Web & Mobile Developer"
          imageUrl="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop"
          actionText="Explore Profile"
          href="#about"
          onActionClick={() => {
            const aboutSection = document.getElementById("about");
            if (aboutSection) {
              aboutSection.scrollIntoView({ behavior: "smooth" });
            }
          }}
        />
      </div>
    </div>
  );
}
