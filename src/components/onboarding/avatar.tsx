import React from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";

interface AvatarSelectionProps {
  onSubmit: (values: { avatarId: string; name: string }) => void;
  defaultValues?: {
    avatarId: string;
    name: string;
  };
}

export const AVATAR_NAMES = [
  'Aztec',
  'Egypt',
  'Mage',
  'Minotaur',
  'Mongol',
  'Ottoman',
  'Paladin',
  'Pirate',
  'Samurai',
  'Satyr',
  'Vulcan',
  'Warlock',
  'BloodKnight',
  'Conquistador',
  'Ethiopia',
  'KoreanHwarang',
  'Legionnaire',
  'Maori',
  'Ninja',
  'PersianImmortal',
  'Spartan',
  'Viking',
  'Warchief',
  'Zulu'
];

export function AvatarSelection({ onSubmit, defaultValues }: AvatarSelectionProps) {
  const [selectedAvatar, setSelectedAvatar] = React.useState<string>(() => {
    return defaultValues?.avatarId || '';
  });

  const [avatarName, setAvatarName] = React.useState<string>(() => {
    return defaultValues?.name || '';
  });

  const [currentPage, setCurrentPage] = React.useState(() => {
    // Initialize to the page containing the selected avatar if one exists
    if (defaultValues?.avatarId) {
      const index = AVATAR_NAMES.indexOf(defaultValues.avatarId);
      return Math.floor(index / 4);
    }
    return 0;
  });
  
  const itemsPerPage = 4;
  const totalPages = Math.ceil(AVATAR_NAMES.length / itemsPerPage);

  // Ensure selected avatar is visible
  React.useEffect(() => {
    if (selectedAvatar) {
      const selectedIndex = AVATAR_NAMES.indexOf(selectedAvatar);
      const selectedPage = Math.floor(selectedIndex / itemsPerPage);
      if (currentPage !== selectedPage) {
        setCurrentPage(selectedPage);
      }
    }
  }, [selectedAvatar, itemsPerPage, currentPage]);

  const handleAvatarSelect = (avatarName: string) => {
    setSelectedAvatar(avatarName);
    if (avatarName) {
      onSubmit({ avatarId: avatarName, name: avatarName });
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setAvatarName(newName);
    if (selectedAvatar) {
      onSubmit({ avatarId: selectedAvatar, name: newName });
    }
  };

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const visibleAvatars = React.useMemo(() => {
    return AVATAR_NAMES.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
    );
  }, [currentPage, itemsPerPage]);

  return (
    <div className="flex justify-center w-full">
      <Card className="w-full bg-[#051B2C]/50 border-white/10">
        <CardHeader className="px-8 pt-8">
          <CardTitle className="text-3xl font-bold text-white mb-2">Customize Your Avatar's Appearance</CardTitle>
          <CardDescription className="text-lg text-white/60" style={{ color: '#808080' }}>
            Select an avatar and give it a name to represent you in the competition
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          {/* Selected Avatar Display */}
          {selectedAvatar && (
            <div className="flex justify-center mb-8">
              <div className="relative w-[150px] h-[150px] rounded-lg border-2 border-purple-500 overflow-hidden">
                <Image
                  src={`/${selectedAvatar}.png`}
                  alt={`Selected ${selectedAvatar} Avatar`}
                  width={150}
                  height={150}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-purple-500/30" />
              </div>
            </div>
          )}

          {/* Avatar Carousel */}
          <div className="relative flex items-center justify-center mb-8">
            {currentPage > 0 && (
              <button
                onClick={prevPage}
                className="absolute left-0 z-10 p-2 text-white hover:text-white"
              >
                <ChevronLeft className="w-12 h-12 text-white" />
              </button>
            )}
            
            <div className="flex gap-4 justify-center">
              {visibleAvatars.map((name) => (
                <button
                  key={name}
                  onClick={() => handleAvatarSelect(name)}
                  className={`
                    group relative w-[125px] h-[125px] rounded-lg border-2 overflow-hidden
                    ${selectedAvatar === name 
                      ? 'border-purple-500' 
                      : 'border-white/20 hover:border-purple-500/50'
                    }
                    transition-all duration-200
                  `}
                >
                  <Image
                    src={`/${name}.png`}
                    alt={`${name} Avatar`}
                    width={125}
                    height={125}
                    className={`
                      object-cover w-full h-full transition-transform duration-200
                      ${selectedAvatar === name ? 'scale-110' : 'group-hover:scale-105'}
                    `}
                  />
                  <div className={`
                    absolute inset-0 bg-purple-500/20 opacity-0 transition-opacity duration-200
                    ${selectedAvatar === name ? 'opacity-0' : 'group-hover:opacity-100'}
                  `} />
                </button>
              ))}
            </div>

            {currentPage < totalPages - 1 && (
              <button
                onClick={nextPage}
                className="absolute right-0 z-10 p-2 text-white hover:text-white"
              >
                <ChevronRight className="w-12 h-12 text-white" />
              </button>
            )}
          </div>

          {/* Pagination Indicator */}
          <div className="flex justify-center gap-2 mb-8">
            {Array.from({ length: totalPages }).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  currentPage === index ? 'bg-white' : 'bg-white/20'
                }`}
              />
            ))}
          </div>

          {/* Avatar Name Input */}
          <div className="space-y-4 max-w-sm mx-auto mt-2 mb-19">
            <div className="space-y-2">
              <Label htmlFor="avatarName" className="text-lg font-medium text-white">
                Avatar Name
              </Label>
              <Input
                id="avatarName"
                placeholder="Enter a name for your avatar"
                value={avatarName}
                onChange={handleNameChange}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>
            {!selectedAvatar && (
              <p className="text-white text-sm">
                Please select an avatar from above
              </p>
            )}
            {!avatarName && (
              <p className="text-white text-sm">
                Please enter a name for your avatar
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}