import React from "react";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserRoleMutation,
} from "../../slices/adminApiSLice";
import { toast } from "react-toastify";
import { Loader } from "../../components/ui/Loader";
import { Message } from "../../components/ui/Message";
import { Button, Table } from "react-bootstrap";

const ManageUsers = () => {
  const { data: users, isLoading, error, refetch } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUserRole] = useUpdateUserRoleMutation();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure ")) {
      try {
        await deleteUser(id).unwrap();
        toast.success("User deleted");
      } catch (err) {
        toast.error(err?.data?.message);
      }
    }
  };

  // update user role
  const handleRoleUpdate = async (userId) => {
    try {
      const res = await updateUserRole(userId).unwrap();
      toast.success(res.message);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;

  return (
    <div className="p-4">
      <h2>Manage Users</h2>
      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user._id}>
              <td> {user._Id}</td>
              <td>{user.userName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <div className="d-flex flex-column ">
                  <Button
                    variant="info"
                    size="sm"
                    onClick={() => handleRoleUpdate(user._id)}
                  >
                    {user.role === "admin"
                      ? "Demote to User"
                      : "Promoto to Admin"}{" "}
                  </Button>{" "}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(user._id)}
                    className="me-2"
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ManageUsers;
