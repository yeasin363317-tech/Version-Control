import { Link } from 'react-router-dom';
import { User, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Teacher } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface TeacherCardProps {
  teacher: Teacher;
}

export default function TeacherCard({ teacher }: TeacherCardProps) {
  const { t } = useLanguage();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const photoUrl = teacher.photo?.trim() || '';
  const hasPhoto = photoUrl.length > 0;
  const hasSubtitle = Boolean(
    teacher.designation_bn?.trim() ||
      teacher.designation_en?.trim() ||
      teacher.qualification_bn?.trim() ||
      teacher.qualification_en?.trim(),
  );

  const teacherName = t(teacher.name_bn, teacher.name_en) || 'Teacher';

  useEffect(() => {
    setImgLoaded(false);
    setImgError(false);
  }, [photoUrl]);

  const showPhoto = hasPhoto && !imgError;
  const showPlaceholder = !hasPhoto || imgError || !imgLoaded;

  return (
    <div className="card-base overflow-hidden flex flex-col text-center group h-full min-w-0">
      <div className="h-12 sm:h-20 tint tint-green !rounded-none !border-0 group-hover:!transform-none relative overflow-hidden">
        <div className="absolute -right-6 -top-8 w-28 h-28 rounded-full bg-white/50" aria-hidden="true" />
        <div className="absolute left-4 -bottom-10 w-24 h-24 rounded-full bg-white/40" aria-hidden="true" />
      </div>

      <div className="px-2.5 sm:px-5 pb-4 sm:pb-6 -mt-8 sm:-mt-12 flex flex-col items-center flex-1 min-w-0">
        <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-primary/10 ring-4 ring-white shadow-md mb-2 sm:mb-4 transition-transform duration-500 group-hover:scale-105 shrink-0">
          {showPhoto && (
            <img
              key={photoUrl}
              src={photoUrl}
              alt={teacherName}
              loading="lazy"
              decoding="async"
              onLoad={() => setImgLoaded(true)}
              onError={() => {
                setImgLoaded(false);
                setImgError(true);
              }}
              referrerPolicy="no-referrer"
              className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-300 ${
                imgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}

          {showPlaceholder && (
            <div className="absolute inset-0 flex items-center justify-center bg-primary/10" role="img" aria-label={teacherName}>
              <User size={28} className="text-primary/60 sm:hidden" aria-hidden="true" />
              <User size={36} className="text-primary/60 hidden sm:block" aria-hidden="true" />
            </div>
          )}
        </div>

        <h3 className="text-[13px] sm:text-base font-bold text-foreground mb-0.5 leading-snug line-clamp-2 break-words w-full px-0.5">
          {teacherName}
        </h3>
        {(teacher.designation_bn?.trim() || teacher.designation_en?.trim()) && (
          <p className="text-xs sm:text-sm font-semibold text-primary mb-1 line-clamp-1 w-full px-0.5">
            {t(teacher.designation_bn, teacher.designation_en)}
          </p>
        )}
        {(teacher.qualification_bn?.trim() || teacher.qualification_en?.trim()) && (
          <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-5 leading-relaxed line-clamp-2 w-full px-0.5">
            {t(teacher.qualification_bn, teacher.qualification_en)}
          </p>
        )}
        <Link
          to={`/teachers/${teacher.id}`}
          className={`${hasSubtitle ? '' : 'mt-2'} mt-auto flex items-center justify-center gap-1 sm:gap-2 text-[11px] sm:text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground w-full sm:w-auto px-2.5 sm:px-5 py-1.5 sm:py-2 rounded-full border border-primary transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md whitespace-nowrap`}
        >
          <Eye size={13} className="sm:hidden" aria-hidden="true" />
          <Eye size={15} className="hidden sm:block" aria-hidden="true" />
          <span className="sm:hidden">দেখুন</span>
          <span className="hidden sm:inline">{t('বিস্তারিত দেখুন', 'View Details')}</span>
        </Link>
      </div>
    </div>
  );
}
