import {Disclosure} from '@headlessui/react';
import {Await, Form, useParams, useRouteLoaderData} from '@remix-run/react';
import {CartForm} from '@shopify/hydrogen';
import {Suspense, useEffect, useMemo} from 'react';
import useWindowScroll from 'react-use/esm/useWindowScroll';

import {Backpack, CircleUserRound, Search, UserRound} from 'lucide-react';
import {type LayoutQuery} from 'storefrontapi.generated';
import {Cart} from '~/components/Cart';
import {CartLoading} from '~/components/CartLoading';
import {CountrySelector} from '~/components/CountrySelector';
import {Drawer, useDrawer} from '~/components/Drawer';
import {IconCaret, IconLogin, IconMenu, IconSearch} from '~/components/Icon';
import {Link} from '~/components/Link';
import {Heading, Section, Text} from '~/components/Text';
import {useCartFetchers} from '~/hooks/useCartFetchers';
import {useIsHydrated} from '~/hooks/useIsHydrated';
import {
  type ChildEnhancedMenuItem,
  type EnhancedMenu,
  useIsHomePath,
} from '~/lib/utils';
import {cn} from '~/lib/utils/cn';
import type {RootLoader} from '~/root';
import {Button} from './ui/button';
import {Input} from './ui/input';

type LayoutProps = {
  children: React.ReactNode;
  layout?: LayoutQuery & {
    headerMenu?: EnhancedMenu | null;
    footerMenu?: EnhancedMenu | null;
  };
};

export function PageLayout({children, layout}: LayoutProps) {
  const {headerMenu, footerMenu} = layout || {};
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="">
          <a href="#mainContent" className="sr-only">
            Skip to content
          </a>
        </div>
        {headerMenu && layout?.shop.name && (
          <Header title={layout.shop.name} menu={headerMenu} />
        )}
        <main role="main" id="mainContent" className="flex-grow">
          {children}
        </main>
      </div>
      {footerMenu && <Footer menu={footerMenu} />}
    </>
  );
}

function Header({title, menu}: {title: string; menu?: EnhancedMenu}) {
  const isHome = useIsHomePath();

  const {
    isOpen: isCartOpen,
    openDrawer: openCart,
    closeDrawer: closeCart,
  } = useDrawer();

  const {
    isOpen: isMenuOpen,
    openDrawer: openMenu,
    closeDrawer: closeMenu,
  } = useDrawer();

  const addToCartFetchers = useCartFetchers(CartForm.ACTIONS.LinesAdd);

  // toggle cart drawer when adding to cart
  useEffect(() => {
    if (isCartOpen || !addToCartFetchers.length) return;
    openCart();
  }, [addToCartFetchers, isCartOpen, openCart]);

  return (
    <>
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      {menu && (
        <MenuDrawer isOpen={isMenuOpen} onClose={closeMenu} menu={menu} />
      )}
      <DesktopHeader
        isHome={isHome}
        title={title}
        menu={menu}
        openCart={openCart}
      />
      <MobileHeader
        isHome={isHome}
        title={title}
        openCart={openCart}
        openMenu={openMenu}
      />
    </>
  );
}

function CartDrawer({isOpen, onClose}: {isOpen: boolean; onClose: () => void}) {
  const rootData = useRouteLoaderData<RootLoader>('root');
  console.log(rootData);
  if (!rootData) return null;

  return (
    <Drawer open={isOpen} onClose={onClose} heading="Cart" openFrom="right">
      <div className="grid">
        <Suspense fallback={<CartLoading />}>
          <Await resolve={rootData?.cart}>
            {(cart) => <Cart layout="drawer" onClose={onClose} cart={cart} />}
          </Await>
        </Suspense>
      </div>
    </Drawer>
  );
}

export function MenuDrawer({
  isOpen,
  onClose,
  menu,
}: {
  isOpen: boolean;
  onClose: () => void;
  menu: EnhancedMenu;
}) {
  return (
    <Drawer open={isOpen} onClose={onClose} openFrom="left" heading="Menu">
      <div className="grid">
        <MenuMobileNav menu={menu} onClose={onClose} />
      </div>
    </Drawer>
  );
}

function MenuMobileNav({
  menu,
  onClose,
}: {
  menu: EnhancedMenu;
  onClose: () => void;
}) {
  return (
    <nav className="grid gap-4 p-6 sm:gap-6 sm:px-12 sm:py-8">
      {/* Top level menu items */}
      {(menu?.items || []).map((item) => (
        <span key={item.id} className="block">
          <Link
            to={item.to}
            target={item.target}
            onClick={onClose}
            className={({isActive}) =>
              isActive ? 'pb-1 border-b -mb-px' : 'pb-1'
            }
          >
            <Text as="span" size="copy">
              {item.title}
            </Text>
          </Link>
        </span>
      ))}
    </nav>
  );
}

function MobileHeader({
  title,
  isHome,
  openCart,
  openMenu,
}: {
  title: string;
  isHome: boolean;
  openCart: () => void;
  openMenu: () => void;
}) {
  // useHeaderStyleFix(containerStyle, setContainerStyle, isHome);

  const params = useParams();

  return (
    <header
      role="banner"
      className={`${
        isHome
          ? 'bg-primary/80 dark:bg-contrast/60 text-contrast dark:text-primary shadow-darkHeader'
          : 'bg-contrast/80 text-primary'
      } flex lg:hidden items-center h-nav sticky backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-4 px-4 md:px-8`}
    >
      <div className="flex items-center justify-start w-full gap-4">
        <button
          onClick={openMenu}
          className="relative flex items-center justify-center w-8 h-8"
        >
          <IconMenu />
        </button>
        <Form
          method="get"
          action={params.locale ? `/${params.locale}/search` : '/search'}
          className="items-center gap-2 sm:flex"
        >
          <button
            type="submit"
            className="relative flex items-center justify-center w-8 h-8"
          >
            <IconSearch />
          </button>
          <Input
            className={
              isHome
                ? 'focus:border-contrast/20 dark:focus:border-primary/20'
                : 'focus:border-primary/20'
            }
            type="search"
            // variant="minisearch"
            placeholder="Search"
            name="q"
          />
        </Form>
      </div>

      <Link
        className="flex items-center self-stretch leading-[3rem] md:leading-[4rem] justify-center flex-grow w-full h-full"
        to="/"
      >
        <Heading
          className="font-bold text-center leading-none"
          as={isHome ? 'h1' : 'h2'}
        >
          {title}
        </Heading>
      </Link>

      <div className="flex items-center justify-end w-full gap-4">
        <AccountLink className="relative flex items-center justify-center w-8 h-8" />
        <CartCount isHome={isHome} openCart={openCart} />
      </div>
    </header>
  );
}

function DesktopHeader({
  isHome,
  menu,
  openCart,
  title,
}: {
  isHome: boolean;
  openCart: () => void;
  menu?: EnhancedMenu;
  title: string;
}) {
  const params = useParams();
  const {y} = useWindowScroll();

  return (
    <header
      role="banner"
      className={cn(
        y > 50 && 'opacity-0',
        'hidden h-nav lg:flex items-center sticky transition duration-300 z-40 top-0 justify-between w-full leading-none gap-8 px-12 py-12',
      )}
    >
      <div className="flex justify-between items-center w-full gap-12">
        <Link
          className={cn(
            isHome ? 'text-primary' : 'text-contrast',
            'group inline-flex items-center gap-1',
          )}
          to="/"
          prefetch="intent"
        >
          <span className="text-3xl font-normal tracking-[-0.045em]">
            {title}
          </span>

          <span className="flex items-center gap-1">
            <span className="h-px w-3 bg-current opacity-40 transition-all duration-300 group-hover:w-6" />

            <span className="text-[0.65rem] font-light uppercase tracking-[0.2em] opacity-70 transition-all duration-300 group-hover:opacity-100">
              Outdoor
            </span>
          </span>
        </Link>
        <div
          className={cn(
            isHome ? 'bg-primary text-contrast' : 'bg-contrast/80 text-primary',
            'flex items-center shadow-lg h-16 rounded-3xl px-4 py-4 transition-opacity',
          )}
        >
          <nav className="flex gap-1 h-full items-center">
            {/* Top level menu items */}
            {(menu?.items || []).map((item) => (
              <Button
                asChild
                variant="unstyled"
                className="h-full"
                key={item.id}
              >
                <Link
                  to={item.to}
                  target={item.target}
                  prefetch="intent"
                  className=""
                  //   className={({isActive}) =>
                  //     cn(isActive ? 'bg-accent text-primary' : 'bg-transparent')
                  //   }
                >
                  {item.title}
                </Link>
              </Button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Form
              method="get"
              action={params.locale ? `/${params.locale}/search` : '/search'}
              className="flex items-center gap-2"
            >
              <Input
                className={
                  isHome
                    ? 'focus:border-contrast/20 dark:focus:border-primary/20'
                    : 'focus:border-primary/20'
                }
                type="search"
                // variant="minisearch"
                placeholder="Search"
                name="q"
              />
              <Button
                size="icon"
                type="submit"
                variant="unstyled"
                className="relative"
              >
                <Search size={64} width={48} height={48} />
              </Button>
            </Form>
            <AccountLink className="relative" />
            <CartCount isHome={isHome} openCart={openCart} />
          </div>
        </div>
      </div>
    </header>
  );
}

function AccountLink({className}: {className?: string}) {
  const rootData = useRouteLoaderData<RootLoader>('root');
  const isLoggedIn = rootData?.isLoggedIn;

  return (
    <Button asChild size="icon" variant="unstyled" className={className}>
      <Link to="/account">
        <Suspense fallback={<IconLogin />}>
          <Await resolve={isLoggedIn} errorElement={<IconLogin />}>
            {(isLoggedIn) => (isLoggedIn ? <CircleUserRound /> : <UserRound />)}
          </Await>
        </Suspense>
      </Link>
    </Button>
  );
}

function CartCount({
  isHome,
  openCart,
}: {
  isHome: boolean;
  openCart: () => void;
}) {
  const rootData = useRouteLoaderData<RootLoader>('root');
  if (!rootData) return null;

  return (
    <Suspense fallback={<Badge count={0} dark={isHome} openCart={openCart} />}>
      <Await resolve={rootData?.cart}>
        {(cart) => (
          <Badge
            dark={isHome}
            openCart={openCart}
            count={cart?.totalQuantity || 0}
          />
        )}
      </Await>
    </Suspense>
  );
}

function Badge({
  openCart,
  dark,
  count,
}: {
  count: number;
  dark: boolean;
  openCart: () => void;
}) {
  const isHydrated = useIsHydrated();

  const BadgeCounter = useMemo(
    () => (
      <>
        <Backpack size={24} />
        <div
          className={cn(
            'absolute bottom-0 right-0 text-[0.525rem] font-medium subpixel-antialiased h-4 min-w-[0.75rem] flex items-center justify-center leading-none text-center rounded-full w-auto px-[0.125rem] pb-px',
            dark
              ? 'text-primary bg-contrast dark:text-contrast dark:bg-primary'
              : 'text-contrast bg-primary',
          )}
        >
          <span className="flex items-center justify-center h-full -mb-[3px]">
            {count || 0}
          </span>
        </div>
      </>
    ),
    [count, dark],
  );

  return isHydrated ? (
    <Button
      variant="unstyled"
      size="icon"
      onClick={openCart}
      className="relative flex items-center justify-center w-8 h-8"
    >
      {BadgeCounter}
    </Button>
  ) : (
    <Link
      to="/cart"
      className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
    >
      {BadgeCounter}
    </Link>
  );
}

function Footer({menu}: {menu?: EnhancedMenu}) {
  const isHome = useIsHomePath();
  const itemsCount = menu
    ? menu?.items?.length + 1 > 4
      ? 4
      : menu?.items?.length + 1
    : [];

  return (
    <Section
      divider={isHome ? 'none' : 'top'}
      as="footer"
      role="contentinfo"
      className={`grid min-h-[25rem] items-start grid-flow-row w-full gap-6 py-8 px-6 md:px-8 lg:px-12 md:gap-8 lg:gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-${itemsCount}
        bg-primary dark:bg-contrast dark:text-primary text-contrast overflow-hidden`}
    >
      <FooterMenu menu={menu} />
      <CountrySelector />
      <div
        className={`self-end pt-8 opacity-50 md:col-span-2 lg:col-span-${itemsCount}`}
      >
        &copy; {new Date().getFullYear()} / Shopify, Inc. Hydrogen is an MIT
        Licensed Open Source project.
      </div>
    </Section>
  );
}

function FooterLink({item}: {item: ChildEnhancedMenuItem}) {
  if (item.to.startsWith('http')) {
    return (
      <a href={item.to} target={item.target} rel="noopener noreferrer">
        {item.title}
      </a>
    );
  }

  return (
    <Link to={item.to} target={item.target} prefetch="intent">
      {item.title}
    </Link>
  );
}

function FooterMenu({menu}: {menu?: EnhancedMenu}) {
  const styles = {
    section: 'grid gap-4',
    nav: 'grid gap-2 pb-6',
  };

  return (
    <>
      {(menu?.items || []).map((item) => (
        <section key={item.id} className={styles.section}>
          <Disclosure>
            {({open}) => (
              <>
                <Disclosure.Button className="text-left md:cursor-default">
                  <Heading className="flex justify-between" size="lead" as="h3">
                    {item.title}
                    {item?.items?.length > 0 && (
                      <span className="md:hidden">
                        <IconCaret direction={open ? 'up' : 'down'} />
                      </span>
                    )}
                  </Heading>
                </Disclosure.Button>
                {item?.items?.length > 0 ? (
                  <div
                    className={`${
                      open ? `max-h-48 h-fit` : `max-h-0 md:max-h-fit`
                    } overflow-hidden transition-all duration-300`}
                  >
                    <Suspense data-comment="This suspense fixes a hydration bug in Disclosure.Panel with static prop">
                      <Disclosure.Panel static>
                        <nav className={styles.nav}>
                          {item.items.map((subItem: ChildEnhancedMenuItem) => (
                            <FooterLink key={subItem.id} item={subItem} />
                          ))}
                        </nav>
                      </Disclosure.Panel>
                    </Suspense>
                  </div>
                ) : null}
              </>
            )}
          </Disclosure>
        </section>
      ))}
    </>
  );
}
