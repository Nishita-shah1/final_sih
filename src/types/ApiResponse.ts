import { Message } from "@/model/User";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Array<Message>
};

export default ApiResponse;