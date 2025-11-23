export default interface Task {
  taskId: string;
  taskName: string;
  assignee?: { username: string };
  assignor?: { username: string };
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
