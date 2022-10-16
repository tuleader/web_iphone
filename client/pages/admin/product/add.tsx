import {
  Button,
  Card,
  Checkbox,
  Col,
  FormElement,
  Grid,
  Input,
  Row,
  Spacer,
  Textarea,
  Tooltip,
} from '@nextui-org/react';
import Head from 'next/head';
import { useEffect } from 'react';
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { AiOutlineDelete } from 'react-icons/ai';
import { GrAddCircle } from 'react-icons/gr';
import slugify from 'react-slugify';
import Swal from 'sweetalert2';
import AdminLayout from '../../../components/common/AdminLayout';
import SecureAdminPages from '../../../components/SecureAdminPages';
import api from '../../../libs/api';
import { useAttribute } from '../../../libs/swr/useAttribute';
import { useCategory } from '../../../libs/swr/useCategory';
import { IconButton } from '../category';

export type Attribute = {
  id: number;
  name: string;
  attributes: {
    id: number;
    name: string;
  };
};

export type FormValues = {
  name: string;
  slug: string;
  description: string;
  category: {
    id: number;
  };
  price: number;
  quantity: number;
  isNew: boolean;
  isActive: boolean;
  isPopular: boolean;
  images: {
    url: string;
  }[];
  checkbox: {
    attributeId: number;
    attributeName: string;
    isSelected: boolean;
  }[];
  attributeValues: {
    attributeValueId: number;
  }[];
};

export default function Add() {
  let { data: attributes } = useAttribute();
  let { data: category } = useCategory();

  const {
    control,
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'images',
  });

  useEffect(() => {
    setValue('images', [{ url: '' }]);
  }, []);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    let { checkbox, attributeValues, ...result } = data;
    checkbox = checkbox.filter((i) => i).filter((i) => i.isSelected);

    const attributesSelected: any = [];
    attributes?.forEach((i) => {
      const index = checkbox.findIndex((c) => c.attributeId == i.id);
      if (index != -1) attributesSelected.push(i);
    });

    let newAttributeValues: any = [];
    attributeValues.forEach((i) => {
      const id = i.attributeValueId;
      attributesSelected.forEach((opt: any) => {
        const res = opt.attributeValues.find((k: any) => k.id == id);
        if (res) newAttributeValues.push(res);
      });
    });
    newAttributeValues = newAttributeValues.map((i: any) => ({ id: i.id }));
    (result as any).attributeValues = newAttributeValues;

    try {
      const res = await api.post('http://localhost:4000/product', result);
      Swal.fire({
        title: 'Tạo thành công!',
        icon: 'success',
      });
    } catch (error: any) {
      Swal.fire({
        title: error.response.data.message,
        icon: 'error',
      });
      console.log(error);
    }
  };

  return (
    <SecureAdminPages>
      {' '}
      <Head>
        <title>Tạo sản phẩm</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <AdminLayout title='Tạo sản phẩm'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid.Container gap={2} justify='center'>
            <Grid xs={4}>
              <Card>
                <Card.Body>
                  <Row>
                    <Controller
                      control={control}
                      name='name'
                      render={({ field: { value, onChange } }) => (
                        <Input
                          value={value}
                          onChange={(e: React.ChangeEvent<FormElement>) => {
                            setValue('name', e.target.value);
                            setValue('slug', slugify(e.target.value));
                          }}
                          fullWidth
                          label='Tên'
                          required
                        />
                      )}
                    />
                  </Row>
                  <Spacer y={1} />
                  <Row>
                    <Input
                      fullWidth
                      label='Slug'
                      {...register('slug')}
                      required
                    />
                  </Row>
                  <Spacer y={1} />
                  <span style={{ fontSize: 14 }}>Danh mục: &nbsp;</span>
                  {category && (
                    <select
                      {...register(`category.id`, { valueAsNumber: true })}
                      defaultValue={category[0].id}
                    >
                      {category?.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  )}
                  <Spacer y={1} />
                  <div className='variant-top'>
                    <div className='variant-input-text'>
                      <Input
                        initialValue='0'
                        label='Số lượng'
                        type='number'
                        {...register(`quantity`, {
                          required: true,
                          valueAsNumber: true,
                        })}
                        min='0'
                      />
                    </div>
                    <div className='variant-input-text'>
                      <Input
                        initialValue='0'
                        label='Đơn giá'
                        type='number'
                        {...register(`price`, {
                          required: true,
                          valueAsNumber: true,
                        })}
                        min='0'
                      />
                    </div>
                  </div>
                  <Spacer y={1} />
                  <Row wrap='wrap'>
                    {attributes && (
                      <Row align='center' style={{ columnGap: 5 }}>
                        {attributes.map((item, i) => (
                          <Col
                            key={item.name}
                            span={6}
                            css={{
                              display: 'flex',
                              alignItems: 'center',
                              columnGap: 5,
                            }}
                          >
                            <>
                              <Controller
                                name={`checkbox.${i}`}
                                control={control}
                                // rules={{ required: true }}
                                render={({ field: { onChange } }) => (
                                  <Checkbox
                                    size='sm'
                                    color='secondary'
                                    onChange={(isSelected) => {
                                      if (isSelected) {
                                        const attributeValues =
                                          item.attributeValues;
                                        const idSelecting = getValues(
                                          `attributeValues.${i}.attributeValueId`
                                        );
                                        const value =
                                          attributeValues.find(
                                            (i) => i.id === idSelecting
                                          )?.value || '';
                                        setValue(
                                          'name',
                                          getValues('name') + ` ${value}`
                                        );
                                        setValue(
                                          'slug',
                                          slugify(getValues('name'))
                                        );
                                      }

                                      onChange({
                                        attributeId: item.id,
                                        attributeName: item.name,
                                        isSelected,
                                      });
                                    }}
                                  >
                                    {item.name}
                                  </Checkbox>
                                )}
                              />

                              <select
                                {...register(
                                  `attributeValues.${i}.attributeValueId`,
                                  {
                                    valueAsNumber: true,
                                  }
                                )}
                                defaultValue={item.attributeValues[0].id}
                                style={{ fontSize: 13 }}
                              >
                                {item.attributeValues.map((o) => (
                                  <option key={o.value} value={o.id}>
                                    {o.value}
                                  </option>
                                ))}
                              </select>
                            </>
                          </Col>
                        ))}
                      </Row>
                    )}
                  </Row>
                  <Spacer y={1} />
                  <>
                    <Row align='center'>
                      <span style={{ fontSize: '14px' }}>Hình ảnh: &nbsp;</span>
                      <Tooltip
                        content='Thêm'
                        onClick={() =>
                          append({
                            url: '',
                          })
                        }
                      >
                        <IconButton type='button'>
                          <GrAddCircle size={20} />
                        </IconButton>
                      </Tooltip>
                    </Row>
                    <ul style={{ marginLeft: 0, marginRight: 0 }}>
                      {fields.map((item, index) => (
                        <li
                          key={item.id}
                          style={{
                            display: 'flex',
                            columnGap: '10px',
                            position: 'relative',
                            marginRight: 30,
                          }}
                        >
                          <Input
                            value={item.url}
                            fullWidth
                            {...register(`images.${index}.url`, {
                              required: true,
                            })}
                            aria-label='images'
                            required
                          />

                          {fields.length > 1 && (
                            <Tooltip
                              content='Xóa'
                              color='error'
                              onClick={() => remove(index)}
                              style={{
                                position: 'absolute',
                                top: '50%',
                                right: '-10px',
                                transform: 'translate(100%, -50%)',
                              }}
                            >
                              <IconButton type='button'>
                                <AiOutlineDelete size={20} fill='#FF0080' />
                              </IconButton>
                            </Tooltip>
                          )}
                        </li>
                      ))}
                    </ul>
                  </>
                  <Row>
                    <Textarea
                      fullWidth
                      label='Mô tả'
                      {...register('description')}
                    />
                  </Row>
                  <Spacer y={1} />
                  <Row>
                    <Col>
                      <Controller
                        name={`isActive`}
                        control={control}
                        render={({ field: { onChange } }) => (
                          <Checkbox
                            size='sm'
                            color='secondary'
                            onChange={(isSelected) => {
                              onChange(isSelected);
                            }}
                          >
                            Hiển thị
                          </Checkbox>
                        )}
                      />
                    </Col>
                    <Col>
                      <Controller
                        name={`isNew`}
                        control={control}
                        render={({ field: { onChange } }) => (
                          <Checkbox
                            size='sm'
                            color='secondary'
                            onChange={(isSelected) => {
                              onChange(isSelected);
                            }}
                          >
                            Mới
                          </Checkbox>
                        )}
                      />
                    </Col>
                    <Col>
                      <Controller
                        name={`isPopular`}
                        control={control}
                        render={({ field: { onChange } }) => (
                          <Checkbox
                            size='sm'
                            color='secondary'
                            onChange={(isSelected) => {
                              onChange(isSelected);
                            }}
                          >
                            Nổi bật
                          </Checkbox>
                        )}
                      />
                    </Col>
                  </Row>
                  <Spacer y={1} />

                  <Row justify='center'>
                    <Button type='submit' shadow auto color='secondary'>
                      Tạo sản phẩm
                    </Button>
                  </Row>
                </Card.Body>
              </Card>
            </Grid>
          </Grid.Container>
        </form>
        <style jsx>{`
          .variant-top {
            display: flex;
            align-items: center;
            column-gap: 15px;
            margin-bottom: 5px;
          }
          .variant-input-text {
            display: flex;
            align-items: center;
          }
          .variant-item {
            padding-top: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid;
            margin-bottom: 0;
          }
          .variant-title {
            display: flex;
            align-items: center;
            column-gap: 10px;
            margin-bottom: 10px;
          }
          .variant-title h5 {
            margin-bottom: 0;
          }
        `}</style>
      </AdminLayout>
    </SecureAdminPages>
  );
}
