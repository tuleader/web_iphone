import { Button, Navbar, Text } from '@nextui-org/react';
import { signOut } from 'next-auth/react';

export default function MyNB() {
  const handleSignOut = () => {
    signOut({ redirect: false });
  };

  return (
    <div style={{backgroundColor: "#fdfdff"}}>
      {' '}
      <Navbar isBordered>
        <Navbar.Brand>
          <Text b color='inherit' hideIn='xs'>
            ETOET
          </Text>
        </Navbar.Brand>
        <Navbar.Content>
          <Navbar.Item>
            <Button onPress={handleSignOut} auto flat color='secondary'>
              Đăng xuất
            </Button>
          </Navbar.Item>
        </Navbar.Content>
      </Navbar>
    </div>
  );
}