import {MediaFile} from '@shopify/hydrogen';
import type {
  Media,
  MediaImage,
  Video as MediaVideo,
} from '@shopify/hydrogen/storefront-api-types';

type SpreadMediaProps = {
  data: Media | MediaImage | MediaVideo;
  loading?: HTMLImageElement['loading'];
  sizes: string;
};

export const SpreadMedia = ({data, loading, sizes}: SpreadMediaProps) => {
  return (
    <MediaFile
      data={data}
      className="block object-cover w-full h-full"
      mediaOptions={{
        video: {
          controls: false,
          muted: true,
          loop: true,
          playsInline: true,
          autoPlay: true,
          previewImageOptions: {src: data.previewImage?.url ?? ''},
        },
        image: {
          loading,
          crop: 'top',
          sizes,
          alt: data.alt || '',
        },
      }}
    />
  );
};
