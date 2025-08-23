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
import { FaTrash, FaUser, FaUserShield } from "react-icons/fa";

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
  const handleRoleUpdate = async (userId, newRole) => {
    try {
      const res = await updateUserRole({ id: userId, role: newRole }).unwrap();
      toast.success("User updated successfully");
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
              <td>
                <span
                  className={`badge ${
                    user.role === "admin" ? "bg-primary" : "bg-secondary"
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td>
                <div className="d-flex flex-column gap-2 ">
                  {user.role === "admin" ? (
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => handleRoleUpdate(user._id, "user")}
                      className="w-75"
                    >
                      <FaUser />
                      Demote
                    </Button>
                  ) : (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleRoleUpdate(user._id, "admin")}
                      className="w-75"
                    >
                      <FaUser />
                      Promote
                    </Button>
                  )}

                  <Button
                    variant="danger"
                    size="sm"
                    className="px-3 d-flex align-items-center gap-2 w-75"
                    onClick={() => handleDelete(user._id)}
                  >
                    <FaTrash />
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
