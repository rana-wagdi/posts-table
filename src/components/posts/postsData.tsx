import { Table, Button, Modal, Form, Input } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createPosts,
  deletePost,
  getPosts,
  updatePost,
} from "../../api/posts/postsSlice";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteFilled,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { TypedUseSelectorHook } from "react-redux";
import "./post.css";
import type { RootState, AppDispatch } from "../../api/store";
const PostData = () => {
  const [post, setPost] = useState([]);
  const [editFlag, setEditFlag] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postModel, setPostModel] = useState(false);
  const [form] = Form.useForm();

  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      let postsData = await dispatch(getPosts());
      setPost(postsData.payload);
    })();
  }, [dispatch]);

  const handleCancelModal = () => {
    setPostModel(false);
    setIsDeleteModalOpen(false);
  };

  //submit Data
  const ChangeData = async (values: any) => {
    if (!editFlag) {
      await dispatch(createPosts(values));
    } else {
      if (selectedItem) {
        await dispatch(updatePost({ id: selectedItem, values }));
      }
    }
    setPostModel(false);
    setEditFlag(false);
  };

  //deleteButton
  const deleteItem = async () => {
    if (selectedItem) {
      await dispatch(deletePost(selectedItem));
    }
    setIsDeleteModalOpen(false);
  };

  //openModal
  const showChangeModal = (edit: boolean, item: any) => {
    setPostModel(true);
    if (edit) {
      setEditFlag(true);
      setSelectedItem(item.id);
      form.setFieldsValue({
        title: item.title,
        body: item.body,
      });
    } else {
      form.setFieldsValue({
        title: "",
        body: "",
      });
    }
  };
  const showDeleteModal = (item: any) => {
    setSelectedItem(item.id);
    setIsDeleteModalOpen(true);
  };

  let data: any;
  if (post.length > 0) {
    data = post.map((item: any) => {
      return {
        key: item.id,
        id: item.id,
        title: item.title,
        body: item.body,
        action: item,
      };
    });
  }
  const columns = [
    {
      title: "Id",
      dataIndex: "id",
    },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Body",
      dataIndex: "body",
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "12%",
      render: (data: any) => {
        return (
          <>
            <EditOutlined
              onClick={() => showChangeModal(true, data)}
              className="cursor-pointer"
              style={{ color: "#405E75" }}
            />
            <DeleteFilled
              onClick={() => showDeleteModal(data)}
              className="cursor-pointer"
              style={{ color: "red" }}
            />
          </>
        );
      },
    },
  ];
  return (
    <>
      <Button
        type="primary"
        className="add_button"
        icon={<PlusCircleOutlined />}
        onClick={() => showChangeModal(false, "")}
      >
        Add
      </Button>
      <Table className="table_items" dataSource={data} columns={columns} />
      <Modal open={postModel} footer={false} onCancel={handleCancelModal}>
        <Form form={form} onFinish={ChangeData}>
          <Form.Item
            className="col-12"
            label="Title"
            name="title"
            rules={[
              {
                required: true,
                message: "Please input your Title",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            className="col-12"
            label="Body"
            name="body"
            rules={[
              {
                required: true,
                message: "Please input your body",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Button danger onClick={handleCancelModal}>
            Cancel
          </Button>
          ,
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      </Modal>
      <Modal
        open={isDeleteModalOpen}
        onCancel={handleCancelModal}
        footer={[
          <Button onClick={handleCancelModal} key="1">
            Cancel
          </Button>,
          <Button type="primary" onClick={deleteItem} key="2">
            Confirm
          </Button>,
        ]}
      >
        <div>
          <CloseCircleOutlined style={{ color: "red", fontSize: "65px" }} />
        </div>
        <p>
          Are you sure you want to delete this item .!?
        </p>
      </Modal>
    </>
  );
};
export default PostData;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
