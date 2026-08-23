import clsx from 'clsx';

import type {Media} from '@shopify/hydrogen/storefront-api-types';
import type {CollectionContentFragment} from 'storefrontapi.generated';
import {Link} from '~/components/Link';
import {Heading, Text} from '~/components/Text';
import {Button} from './ui/button';
import {Separator} from './ui/separator';
import {SpreadMedia} from './ui/spread-media';

type HeroProps = CollectionContentFragment & {
  height?: 'full';
  top?: boolean;
  loading?: HTMLImageElement['loading'];
};

/**
 * Hero component that renders metafields attached to collection resources
 **/
export function Hero({
  byline,
  cta,
  handle,
  heading,
  height,
  loading,
  spread,
  spreadSecondary,
  top,
}: HeroProps) {
  return (
    <section
      className={clsx(
        'relative justify-end flex flex-col w-full grainy ',
        top && '-mt-nav',
        height === 'full'
          ? 'h-screen'
          : 'aspect-[4/5] sm:aspect-square md:aspect-[5/4] lg:aspect-[3/2] xl:aspect-[2/1]',
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-black/20 z-20" />
      <div className="absolute inset-0 grid flex-grow grid-flow-col pointer-events-none auto-cols-fr -z-10 content-stretch overflow-clip">
        {spread?.reference && (
          <div>
            <SpreadMedia
              sizes={
                spreadSecondary?.reference
                  ? '(min-width: 48em) 50vw, 100vw'
                  : '100vw'
              }
              data={spread.reference as Media}
              loading={loading}
            />
          </div>
        )}
        {spreadSecondary?.reference && (
          <div className="hidden md:block">
            <SpreadMedia
              sizes="50vw"
              data={spreadSecondary.reference as Media}
              loading={loading}
            />
          </div>
        )}
      </div>
      <div className="flex flex-col items-baseline justify-between gap-10 px-6 py-8 sm:px-8 md:px-12 text-primary relative z-50">
        {(heading || byline) && (
          <div className="flex flex-col gap-4">
            {heading?.value && (
              <Heading format as="h2" size="display" className="max-w-md">
                {heading.value}
              </Heading>
            )}
            {byline?.value && (
              <Text format width="narrow" as="p" color="primary" size="lead">
                {byline.value}
              </Text>
            )}
          </div>
        )}
        <Separator className="opacity-50" />
        {cta?.value && (
          <div className="flex justify-between items-center w-full">
            <Text size="copy" className="text-muted">
              Discover the new collection
            </Text>

            <Button asChild>
              <Link to={`/collections/${handle}`} prefetch="viewport">
                {cta.value}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
