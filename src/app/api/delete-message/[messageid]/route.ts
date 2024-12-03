import { NextRequest } from 'next/server'; // Import NextRequest
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { authOptions } from '../../auth/[...nextauth]/options';
import { User } from 'next-auth';

export async function DELETE(
  _request: NextRequest, // First argument must be Request or NextRequest
  { params }: { params: { messageid: string } } // Second argument contains route params
) {
  const messageId = params.messageid; // Get message ID from params
  await dbConnect(); // Connect to the database

  const session = await getServerSession(authOptions); // Retrieve session
  const _user: User = session?.user; // Extract user from session

  if (!session || !_user) {
    return new Response(
      JSON.stringify({ success: false, message: 'Not authenticated' }),
      { status: 401 }
    );
  }

  try {
    // Remove the message with the given ID from the user's messages array
    const updateResult = await UserModel.updateOne(
      { _id: _user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updateResult.modifiedCount === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Message not found or already deleted',
        }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Message deleted' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting message:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error deleting message',
      }),
      { status: 500 }
    );
  }
}
