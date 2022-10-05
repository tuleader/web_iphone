import type { NextPage } from 'next';
import Head from 'next/head';
import AdminLayout from '../../components/AdminLayout';

const Admin: NextPage = () => {
  return (
    <>
      <Head>
        <title>Trang chủ</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <AdminLayout title='Trang chủ'>
        
      </AdminLayout>
    </>
  );
};

export default Admin;