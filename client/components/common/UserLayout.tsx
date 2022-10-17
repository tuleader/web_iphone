import { Badge, Button, Navbar, Spacer } from '@nextui-org/react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaShoppingCart } from 'react-icons/fa';
import ScrollToTop from 'react-scroll-to-top';
import { useCategory } from '../../libs/swr/useCategory';
import Footer from './Footer';
import Logo from './Logo';

interface Props {
  children: React.ReactNode;
}

const UserLayout: NextPage<Props> = ({ children }) => {
  const { data: category } = useCategory();
  const router = useRouter();

  return (
    <>
      <div style={{ backgroundColor: '#fdfdff' }}>
        <Navbar isBordered>
          <Navbar.Brand>
            <Logo url='/' />
          </Navbar.Brand>
          <Navbar.Content
            enableCursorHighlight
            activeColor='secondary'
            hideIn='xs'
            variant='highlight-rounded'
          >
            {category?.map((item, i) => (
              <Link key={i} href={`/category/${item.slug}`}>
                <Navbar.Link
                  isActive={router.asPath === `/category/${item.slug}`}
                >
                  {item.name}
                </Navbar.Link>
              </Link>
            ))}
            {/* <Navbar.Link isActive href='#'> */}
          </Navbar.Content>
          <Navbar.Content>
            <Navbar.Link color='inherit' href=''>
              Đăng nhập
            </Navbar.Link>
            <Navbar.Item>
              <Button color='secondary' auto flat href='#'>
                Đăng ký
              </Button>
            </Navbar.Item>
            <Navbar.Item>
              <Badge color='secondary' content='0' shape='circle'>
                <FaShoppingCart fill='#687076' size={30} />
              </Badge>
            </Navbar.Item>
          </Navbar.Content>
        </Navbar>
      </div>

      {children}

      <Spacer y={6} />
      <Footer />
      <ScrollToTop smooth color='#6f00ff' />
    </>
  );
};

export default UserLayout;
