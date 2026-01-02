declare module 'lucide-react' {
  import * as React from 'react';
  export type LucideProps = React.SVGProps<SVGSVGElement> & { size?: number | string };

  // Explicit, minimal set of icons used in the codebase
  export const Video: React.FC<LucideProps>;
  export const Users: React.FC<LucideProps>;
  export const Brain: React.FC<LucideProps>;
  export const Trophy: React.FC<LucideProps>;
  export const FileText: React.FC<LucideProps>;
  export const Star: React.FC<LucideProps>;
  export const Mic: React.FC<LucideProps>;
  export const MicOff: React.FC<LucideProps>;
  export const VideoOff: React.FC<LucideProps>;
  export const PhoneOff: React.FC<LucideProps>;
  export const MessageSquare: React.FC<LucideProps>;
  export const Upload: React.FC<LucideProps>;
  export const X: React.FC<LucideProps>;
  export const Play: React.FC<LucideProps>;
  export const Clock: React.FC<LucideProps>;
  export const Sparkles: React.FC<LucideProps>;
  export const Send: React.FC<LucideProps>;
  export const Bell: React.FC<LucideProps>;
  export const Check: React.FC<LucideProps>;
  export const Medal: React.FC<LucideProps>;

  export const LogOut: React.FC<LucideProps>;
  export const User: React.FC<LucideProps>;
  export const BookOpen: React.FC<LucideProps>;
  export const Calculator: React.FC<LucideProps>;
  export const Code: React.FC<LucideProps>;
  export const Atom: React.FC<LucideProps>;

  export const ChevronDown: React.FC<LucideProps>;
  export const ChevronLeft: React.FC<LucideProps>;
  export const ChevronRight: React.FC<LucideProps>;
  export const ChevronUp: React.FC<LucideProps>;
  export const MoreHorizontal: React.FC<LucideProps>;

  export const CheckIcon: React.FC<LucideProps>;
  export const CheckAlt: React.FC<LucideProps>;
  export const Search: React.FC<LucideProps>;
  export const Minus: React.FC<LucideProps>;
  export const Circle: React.FC<LucideProps>;

  export const ArrowLeft: React.FC<LucideProps>;
  export const ArrowRight: React.FC<LucideProps>;
  export const Loader2: React.FC<LucideProps>;
  export const PanelLeft: React.FC<LucideProps>;
  export const GripVerticalIcon: React.FC<LucideProps>;

  export const Bot: React.FC<LucideProps>;
  export const Zap: React.FC<LucideProps>;
  export const Shield: React.FC<LucideProps>;

  // Fallback export for any other usage
  const _default: { [key: string]: React.FC<LucideProps> };
  export default _default;
}
