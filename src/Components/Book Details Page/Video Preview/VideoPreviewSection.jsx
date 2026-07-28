import React, { useState, useMemo } from 'react';
import classes from './VideoPreviewSection.module.css';
import { useSelector } from 'react-redux';
import { FaYoutube, FaFacebookF, FaInstagram, FaXTwitter } from 'react-icons/fa6';
import { FaSnapchatGhost, FaTiktok } from 'react-icons/fa';

const PLATFORMS = {
  youtube: {
    accentColor: '#FF0000',
    cardBg: '#FF0000',
    cardText: '#fff',
    Icon: FaYoutube,
    label: 'YouTube',
    portrait: false,
  },
  facebook: {
    accentColor: '#1877F2',
    cardBg: '#1877F2',
    cardText: '#fff',
    Icon: FaFacebookF,
    label: 'Facebook',
    portrait: false,
  },
  instagram: {
    accentColor: '#C13584',
    cardBg: 'linear-gradient(45deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
    cardText: '#fff',
    Icon: FaInstagram,
    label: 'Instagram',
    portrait: true,
  },
  tiktok: {
    accentColor: '#010101',
    cardBg: '#010101',
    cardText: '#fff',
    Icon: FaTiktok,
    label: 'TikTok',
    portrait: true,
  },
  snapchat: {
    accentColor: '#FFBC00',
    cardBg: '#FFBC00',
    cardText: '#000',
    Icon: FaSnapchatGhost,
    label: 'Snapchat',
    portrait: true,
  },
  twitter: {
    accentColor: '#000',
    cardBg: '#000',
    cardText: '#fff',
    Icon: FaXTwitter,
    label: 'X (Twitter)',
    portrait: false,
  },
};

const FALLBACK = {
  accentColor: '#888',
  cardBg: '#888',
  cardText: '#fff',
  Icon: () => null,
  label: 'Video',
  portrait: false,
};

// Returns a direct embed URL for platforms that support iframe embedding,
// or null for platforms that don't (shows external card instead).
const getEmbedSrc = (platform, link) => {
  switch (platform?.toLowerCase()) {
    case 'youtube': {
      const match = link.match(
        /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|shorts\/|watch\?v=|watch\?.+&v=|v\/))([A-Za-z0-9_-]{11})/
      );
      const id = match?.[1];
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    case 'tiktok': {
      const match = link.match(/(?:@[^/]+\/video\/|embed\/v2\/)(\d+)/);
      const id = match?.[1];
      return id ? `https://www.tiktok.com/embed/v2/${id}` : null;
    }
    case 'facebook':
      // Works for public Facebook video URLs
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(link)}&show_text=false&autoplay=false`;
    default:
      // Instagram, Snapchat, Twitter: no iframe embedding support
      return null;
  }
};

const IFRAME_ALLOW = {
  youtube: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
  tiktok: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
  facebook: 'autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share',
};

export default function VideoPreviewSection({ videoLinks }) {
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const [activeIndex, setActiveIndex] = useState(0);

  // Number duplicate platforms: "YouTube 1", "YouTube 2", etc.
  const tabLabels = useMemo(() => {
    if (!videoLinks) return [];
    const counts = {};
    videoLinks.forEach((v) => {
      const p = v.platform?.toLowerCase() || 'video';
      counts[p] = (counts[p] || 0) + 1;
    });
    const indices = {};
    return videoLinks.map((v) => {
      const p = v.platform?.toLowerCase() || 'video';
      const cfg = PLATFORMS[p] ?? FALLBACK;
      if (counts[p] === 1) return cfg.label;
      indices[p] = (indices[p] || 0) + 1;
      return `${cfg.label} ${indices[p]}`;
    });
  }, [videoLinks]);

  if (!videoLinks || videoLinks.length === 0) return null;

  const active = videoLinks[activeIndex];
  const platform = active?.platform?.toLowerCase();
  const config = PLATFORMS[platform] ?? FALLBACK;
  const embedSrc = getEmbedSrc(platform, active.link);

  return (
    <div className={classes.section}>
      <h2 className={classes.title}>
        {language === 'eng' ? 'Video Previews' : 'Aperçus Vidéo'}
      </h2>

      <div className={`${classes.videoContainer} ${config.portrait ? classes.portrait : classes.landscape}`}>
        {embedSrc ? (
          <iframe
            key={active.id}
            src={embedSrc}
            className={classes.iframe}
            frameBorder="0"
            allow={IFRAME_ALLOW[platform] ?? ''}
            allowFullScreen
            title={`${config.label} video`}
            scrolling="no"
          />
        ) : (
          <a
            href={active.link}
            target="_blank"
            rel="noopener noreferrer"
            className={classes.externalCard}
            style={{ background: config.cardBg }}
          >
            <config.Icon className={classes.externalIcon} style={{ color: config.cardText }} />
            <span className={classes.externalLabel} style={{ color: config.cardText }}>
              {language === 'eng' ? `Watch on ${config.label}` : `Voir sur ${config.label}`}
            </span>
            <span className={classes.externalHint} style={{ color: config.cardText, opacity: 0.6 }}>
              {language === 'eng' ? 'Click to open ↗' : 'Cliquer pour ouvrir ↗'}
            </span>
          </a>
        )}
      </div>

      {videoLinks.length > 1 && (
        <div className={classes.tabs}>
          {videoLinks.map((video, index) => {
            const cfg = PLATFORMS[video.platform?.toLowerCase()] ?? FALLBACK;
            const isActive = activeIndex === index;
            return (
              <button
                key={video.id}
                className={`${classes.tab} ${isActive ? classes.tabActive : ''}`}
                style={isActive ? {
                  borderColor: cfg.accentColor,
                  color: cfg.accentColor,
                  background: `${cfg.accentColor}18`,
                } : {}}
                onClick={() => setActiveIndex(index)}
              >
                <cfg.Icon style={{ fontSize: '1.1em', color: isActive ? cfg.accentColor : '#888' }} />
                <span>{tabLabels[index]}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
