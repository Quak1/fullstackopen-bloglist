import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
} from "@mui/material";

import { fetchUsers } from "../reducers/usersReducer";

const UserList = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);
  if (!users) {
    dispatch(fetchUsers());
    return null;
  }

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>
            <Typography variant="h4">Users</Typography>
          </TableCell>
          <TableCell>Blogs created</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <Button component={Link} to={`${user.id}`}>
                {user.name}
              </Button>
            </TableCell>
            <TableCell>{user.blogs.length}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserList;
