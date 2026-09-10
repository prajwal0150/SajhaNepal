import type { ContactChannel, ContactData, ContactStats } from '../types/contactTypes';

export const demoContactStats: ContactStats = {
  provinces: 7,
  districts: 77,
  languages: 2,
  responseWithin: '24/7',
};

export const demoContactChannels: ContactChannel[] = [
  {
    _id: 'ch-hotline',
    type: 'hotline',
    icon: 'hotline',
    title: 'Free hotline',
    ne: 'निःशुल्क होटलाइन',
    description: 'Speak with a trained support volunteer in minutes — in Nepali or English.',
    neDescription: 'समयमा प्राप्त गर्नुहोस् — नेपाली वा अंग्रेजीमा।',
    detail: '+977 01 5550 010',
    tint: 'bg-critical/10 text-critical',
    meta: ['24/7', 'Toll-free', 'EN + नेपाली'],
  },
  {
    _id: 'ch-email',
    type: 'email',
    icon: 'email',
    title: 'Write to us',
    ne: 'हामीलाई लेख्नुहोस्',
    description: 'For non-urgent messages, partnerships and general inquiries — we read every message.',
    neDescription: 'अहिलेको खुराक वा सामान्य प्रश्नका लागि।',
    detail: 'help@saajharahat.org',
    tint: 'bg-primary/10 text-primary',
    meta: ['Non-urgent', 'Within 1 working day', 'EN + नेपाली'],
    href: 'mailto:help@saajharahat.org',
  },
  {
    _id: 'ch-visit',
    type: 'visit',
    icon: 'map',
    title: 'Visit our office',
    ne: 'हाम्रो कार्यालय-danger मा आउनुहोस्',
    description: 'Drop in during office hours for volunteer onboarding, partnerships or to speak with a team member.',
    neDescription: 'स्वयंसेवक प्रशिक्षण वा साझेदारीका लागि आउनुहोस्।',
    detail: 'Baneshwor, Kathmandu',
    tint: 'bg-tertiary/10 text-tertiary',
    meta: ['Mon–Fri, 10 AM – 5 PM', 'Ground floor, Block D', 'In-person'],
  },
  {
    _id: 'ch-social',
    type: 'social',
    icon: 'social',
    title: 'Live updates',
    ne: 'सामाजिक बहस',
    description: 'Follow verified needs, shelter openings, hazard alerts and community updates as they happen.',
    neDescription: 'ज�हानीदार चेतावनी र सामुदायिक तथ्यांक सँगै अपडेट रहोस्।',
    detail: '@saajharahat',
    tint: 'bg-success/10 text-success',
    meta: ['Twitter / Facebook', 'Hazard alerts', 'Public posts'],
    href: 'https://twitter.com/saajharahat',
  },
];

export const demoContactData: ContactData = {
  channels: demoContactChannels,
  stats: demoContactStats,
  isDemo: true,
};
