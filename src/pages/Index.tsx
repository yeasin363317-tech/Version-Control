import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import {
  ArrowRight, Phone, Mail, MapPin, Calendar, Bell, GraduationCap, Users,
  Image as ImageIcon, MessageSquare, Target, Eye, Paperclip,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TeacherCard from '@/components/features/TeacherCard';
import AnimatedSection from '@/components/features/AnimatedSection';

/** Build optimised srcset for Supabase Storage images.
 *  For the static /hero-banner.jpg we skip transformation.
 */
function buildHeroSrcSet(url: string): { src: string; srcSet: string; sizes: string } {
  const isSupabase = url.includes('/storage/v1/object/public/');
  if (!isSupabase) {
    return { src: url, srcSet: '', sizes: '' };
  }
  const sizes = [480, 768, 1200, 1920];
  const srcSet = sizes
    .map(w => `${url}?width=${w}&format=webp&quality=82 ${w}w`)
    .join(', ');
  return {
    src: `${url}?width=1200&format=webp&quality=82`,
    srcSet,
    sizes: '(max-width: 1024px) 100vw, 50vw',
  };
}

function formatDate(dateStr: string, bn: boolean) {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(bn ? 'bn-BD' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function Index() {
  const { t, isBn } = useLanguage();
  const { data } = useData();
  const { madrasaInfo, websiteSettings, teachers, notices, gallery } = data;

  const publishedNotices = notices.filter(n => n.published);
  const photoGallery = gallery.filter(i => i.type === 'photo');

  const heroBannerUrl = websiteSettings.heroBanner || '/hero-banner.jpg';
  const heroImg = useMemo(() => buildHeroSrcSet(heroBannerUrl), [heroBannerUrl]);

  // Two-tone hero title: first word in green, rest in dark text
  const heroTitle = (isBn ? websiteSettings.heroTitle_bn : websiteSettings.heroTitle_en) || '';
  const titleWords = heroTitle.trim().split(/\s+/);
  const titleFirst = titleWords[0] || '';
  const titleRest = titleWords.slice(1).join(' ');

  const stats = [
    { value: madrasaInfo.totalStudents || '—', label: t('শিক্ষার্থী', 'Students') },
    { value: teachers.length, label: t('শিক্ষক', 'Teachers') },
    { value: publishedNotices.length, label: t('নোটিশ', 'Notices') },
    { value: gallery.length, label: t('গ্যালারি', 'Gallery') },
  ];

  const quickLinks = [
    { to: '/notices', label: t('নোটিশ বোর্ড', 'Notice Board'), icon: Bell, tint: 'tint-orange' },
    { to: '/results', label: t('ফলাফল', 'Results'), icon: GraduationCap, tint: 'tint-blue' },
    { to: '/teachers', label: t('শিক্ষকমণ্ডলী', 'Teachers'), icon: Users, tint: 'tint-purple' },
    { to: '/gallery', label: t('গ্যালারি', 'Gallery'), icon: ImageIcon, tint: 'tint-pink' },
    { to: '/complaint', label: t('অভিযোগ', 'Complaint'), icon: MessageSquare, tint: 'tint-teal' },
  ];

  const noticeTints = ['tint-orange', 'tint-blue', 'tint-purple'];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ───────── Hero ───────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, hsl(var(--green-50)) 0%, hsl(0 0% 100%) 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16 lg:py-20 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Text */}
          <div className="text-center lg:text-left">
            <span
              className="eyebrow bg-white"
              style={{ animation: 'page-fade-in 500ms ease 100ms both' }}
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {t('বিসমিল্লাহির রাহমানির রাহিম', 'Bismillahir Rahmanir Rahim')}
            </span>

            <h1
              className="mt-5 text-3xl sm:text-4xl lg:text-5xl xl:text-[3.4rem] font-bold leading-[1.2] text-foreground"
              style={{ animation: 'page-fade-in 500ms ease 200ms both' }}
            >
              <span className="text-primary">{titleFirst}</span>{titleRest ? ' ' : ''}{titleRest}
            </h1>

            <p
              className="mt-4 text-base md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed"
              style={{ animation: 'page-fade-in 500ms ease 300ms both' }}
            >
              {isBn ? websiteSettings.heroSubtitle_bn : websiteSettings.heroSubtitle_en}
            </p>

            <div
              className="mt-7 flex flex-wrap items-center justify-center lg:justify-start gap-3"
              style={{ animation: 'page-fade-in 500ms ease 400ms both' }}
            >
              <Link to="/about" className="btn-primary">
                {t('মাদ্রাসা সম্পর্কে জানুন', 'About Madrasa')}
                <ArrowRight size={16} />
              </Link>
              <Link to="/notices" className="btn-outline">
                <Bell size={16} />
                {t('নোটিশ বোর্ড', 'Notice Board')}
              </Link>
            </div>

            <div
              className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto lg:mx-0"
              style={{ animation: 'page-fade-in 500ms ease 500ms both' }}
            >
              {stats.map((s, i) => (
                <div key={i} className="bg-white border border-border rounded-2xl px-3 py-3 text-center shadow-sm">
                  <p className="text-xl font-bold text-primary">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative max-w-xl w-full mx-auto lg:max-w-none">
            <div className="absolute -inset-3 md:-inset-4 rounded-[2rem] bg-accent rotate-2" aria-hidden="true" />
            <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-xl aspect-[4/3] bg-secondary">
              <img
                src={heroImg.src}
                srcSet={heroImg.srcSet || undefined}
                sizes={heroImg.sizes || undefined}
                alt={t(madrasaInfo.name_bn, madrasaInfo.name_en)}
                // @ts-expect-error fetchpriority is valid HTML but not yet in TS types
                fetchpriority="high"
                loading="eager"
                decoding="sync"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Quick links ───────── */}
      <section className="px-4 md:px-8 -mt-2 pb-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {quickLinks.map(item => {
            const Icon = item.icon;
            return (
              <Link key={item.to} to={item.to} className={`tint ${item.tint} rounded-2xl p-4 md:p-5 flex items-center gap-3`}>
                <span className="icon-chip"><Icon size={20} /></span>
                <span className="font-semibold text-sm md:text-base leading-tight">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ───────── About ───────── */}
      <AnimatedSection as="section" className="py-14 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            <span className="eyebrow">{t('পরিচিতি', 'Introduction')}</span>
            <h2 className="section-title mt-3 mb-4">{t('মাদ্রাসা সম্পর্কে', 'About The Madrasa')}</h2>
            <p className="text-base text-foreground/80 leading-relaxed mb-6 line-clamp-6 whitespace-pre-line">
              {t(madrasaInfo.about_bn, madrasaInfo.about_en)}
            </p>
            <Link to="/about" className="btn-outline">
              {t('আরও জানুন', 'Learn More')}
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: t('মিশন', 'Mission'), text: t(madrasaInfo.mission_bn, madrasaInfo.mission_en), icon: Target, tint: 'tint-green' },
              { label: t('ভিশন', 'Vision'), text: t(madrasaInfo.vision_bn, madrasaInfo.vision_en), icon: Eye, tint: 'tint-blue' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className={`tint ${item.tint} rounded-2xl p-6`}>
                  <span className="icon-chip mb-4"><Icon size={20} /></span>
                  <h3 className="text-lg font-bold mb-2">{item.label}</h3>
                  <p className="text-sm leading-relaxed text-foreground/75">{item.text || '—'}</p>
                </div>
              );
            })}
          </div>
        </div>
      </AnimatedSection>

      {/* ───────── Latest notices ───────── */}
      <AnimatedSection as="section" className="py-14 px-4 md:px-8 bg-secondary/60">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <span className="eyebrow bg-white">{t('সর্বশেষ', 'Latest')}</span>
              <h2 className="section-title mt-3">{t('নোটিশ বোর্ড', 'Notice Board')}</h2>
            </div>
            <Link to="/notices" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1 shrink-0">
              {t('সব দেখুন', 'View All')} <ArrowRight size={14} />
            </Link>
          </div>

          {publishedNotices.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl border border-border">
              <p className="text-muted-foreground">{t('কোনো নোটিশ নেই', 'No notices yet')}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {publishedNotices.slice(0, 3).map((notice, i) => (
                <Link
                  key={notice.id}
                  to="/notices"
                  className="card-base p-5 flex flex-col group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`tint ${noticeTints[i % noticeTints.length]} w-10 h-10 rounded-xl flex items-center justify-center shrink-0`}>
                      <Bell size={18} />
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar size={12} />
                      {formatDate(notice.date, isBn)}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-foreground leading-snug mb-2 group-hover:text-primary transition-colors">
                    {t(notice.title_bn, notice.title_en)}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-line flex-1">
                    {t(notice.description_bn, notice.description_en)}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="font-semibold text-primary flex items-center gap-1">
                      {t('বিস্তারিত', 'Read more')} <ArrowRight size={14} />
                    </span>
                    {notice.attachment && <Paperclip size={14} className="text-muted-foreground" />}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </AnimatedSection>

      {/* ───────── Teachers ───────── */}
      {teachers.length > 0 && (
        <AnimatedSection as="section" className="py-14 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <span className="eyebrow">{t('আমাদের', 'Our')}</span>
                <h2 className="section-title mt-3">{t('শিক্ষকমণ্ডলী', 'Teaching Staff')}</h2>
              </div>
              <Link to="/teachers" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1 shrink-0">
                {t('সব দেখুন', 'View All')} <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {teachers.slice(0, 4).map(teacher => (
                <TeacherCard key={teacher.id} teacher={teacher} />
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* ───────── Gallery ───────── */}
      {photoGallery.length > 0 && (
        <AnimatedSection as="section" className="py-14 px-4 md:px-8 bg-secondary/60">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <span className="eyebrow bg-white">{t('স্মরণীয় মুহূর্ত', 'Moments')}</span>
                <h2 className="section-title mt-3">{t('গ্যালারি', 'Gallery')}</h2>
              </div>
              <Link to="/gallery" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1 shrink-0">
                {t('সব দেখুন', 'View All')} <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
              {photoGallery.slice(0, 6).map(item => (
                <Link
                  key={item.id}
                  to="/gallery"
                  className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-muted border border-border"
                >
                  <img
                    src={item.thumbnail || item.url}
                    alt={t(item.title_bn, item.title_en)}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-xs md:text-sm font-medium text-white line-clamp-2">
                      {t(item.title_bn, item.title_en)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* ───────── Principal's message ───────── */}
      {madrasaInfo.principalMessage_bn && (
        <AnimatedSection as="section" className="py-14 px-4 md:px-8">
          <div className="max-w-5xl mx-auto tint tint-green rounded-3xl p-6 md:p-10 grid md:grid-cols-[auto,1fr] gap-6 md:gap-10 items-center">
            <div className="flex flex-col items-center text-center">
              {madrasaInfo.principalPhoto ? (
                <img
                  src={madrasaInfo.principalPhoto}
                  alt="principal"
                  className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-white shadow-md"
                />
              ) : (
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center">
                  <Users size={40} className="text-primary" />
                </div>
              )}
              {(madrasaInfo.principalName_bn || madrasaInfo.principalName_en) && (
                <>
                  <p className="mt-3 font-bold text-foreground">
                    {t(madrasaInfo.principalName_bn, madrasaInfo.principalName_en)}
                  </p>
                  <p className="text-sm text-muted-foreground">{t('অধ্যক্ষ', 'Principal')}</p>
                </>
              )}
            </div>
            <div>
              <span className="eyebrow bg-white">{t('অধ্যক্ষের বাণী', "Principal's Message")}</span>
              <blockquote className="mt-4 text-base text-foreground/80 leading-relaxed whitespace-pre-line line-clamp-[10]">
                {t(madrasaInfo.principalMessage_bn, madrasaInfo.principalMessage_en)}
              </blockquote>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* ───────── Contact ───────── */}
      <AnimatedSection as="section" className="py-14 px-4 md:px-8 bg-secondary/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <span className="eyebrow bg-white">{t('যোগাযোগ', 'Contact')}</span>
            <h2 className="section-title mt-3">{t('আমাদের সাথে যোগাযোগ করুন', 'Get In Touch')}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 md:gap-5 max-w-4xl mx-auto">
            {[
              { icon: MapPin, label: t('ঠিকানা', 'Address'), value: t(madrasaInfo.address_bn, madrasaInfo.address_en), tint: 'tint-green' },
              { icon: Phone, label: t('ফোন', 'Phone'), value: madrasaInfo.phone1, tint: 'tint-blue' },
              { icon: Mail, label: t('ইমেইল', 'Email'), value: madrasaInfo.email, tint: 'tint-purple' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className={`tint ${item.tint} rounded-2xl p-6 text-center`}>
                  <span className="icon-chip mx-auto mb-3"><Icon size={20} /></span>
                  <p className="text-xs font-semibold opacity-70 mb-1">{item.label}</p>
                  <p className="text-sm font-semibold text-foreground break-words">{item.value}</p>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-8">
            <Link to="/contact" className="btn-primary">
              {t('বিস্তারিত যোগাযোগ তথ্য', 'Full Contact Info')}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </AnimatedSection>

      <Footer />
    </div>
  );
}
