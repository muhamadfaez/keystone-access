import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Inbox } from "lucide-react";
import { Room } from "@shared/types";
import { Card, CardContent } from '../ui/card';
import { useApi, useApiMutation } from '@/hooks/useApi';
import { api } from '@/lib/api-client';
import { Skeleton } from '../ui/skeleton';
import { toast } from 'sonner';
import { EmptyState } from '../layout/EmptyState';
import { Input } from '../ui/input';
import { EditRoomDialog } from './EditRoomDialog';
import { DeleteDialog } from '../keys/DeleteDialog';
export function RoomDataTable() {
  const { data: roomsData, isLoading, error } = useApi<{ items: Room[] }>(['rooms']);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogState, setDialogState] = useState<{
    edit?: Room;
    delete?: Room;
  }>({});
  const filteredRooms = useMemo(() => {
    if (!roomsData?.items) return [];
    return roomsData.items.filter(room =>
      (room.roomNumber ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room.description ?? '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [roomsData, searchTerm]);
  const deleteMutation = useApiMutation<{ id: string }, string>(
    (roomId) => api(`/api/rooms/${roomId}`, { method: 'DELETE' }),
    [['rooms']]
  );
  const handleDelete = () => {
    if (!dialogState.delete) return;
    deleteMutation.mutate(dialogState.delete.id, {
      onSuccess: () => {
        toast.success(`Room "${dialogState.delete?.roomNumber}" deleted successfully.`);
        setDialogState({});
      },
      onError: (err) => {
        toast.error(`Failed to delete room: ${err.message}`);
      }
    });
  };
  const renderContent = () => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell colSpan={3}><Skeleton className="h-8 w-full" /></TableCell>
        </TableRow>
      ));
    }
    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={3} className="text-center text-destructive">
            Error loading rooms: {error.message}
          </TableCell>
        </TableRow>
      );
    }
    if (filteredRooms.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={3}>
            <EmptyState
              icon={<Inbox className="h-12 w-12" />}
              title="No Rooms Found"
              description="No rooms match your search. Try adding a new room."
            />
          </TableCell>
        </TableRow>
      );
    }
    return filteredRooms.map((room) => (
      <TableRow key={room.id}>
        <TableCell className="font-medium">{room.roomNumber}</TableCell>
        <TableCell>{room.description}</TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setDialogState({ edit: room })}>Edit</DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                onClick={() => setDialogState({ delete: room })}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ));
  };
  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <div className="mb-4">
            <Input
              placeholder="Search rooms..."
              className="w-full md:max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room Number / Area</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{renderContent()}</TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {dialogState.edit && (
        <EditRoomDialog
          isOpen={!!dialogState.edit}
          onOpenChange={(open) => !open && setDialogState({})}
          roomData={dialogState.edit}
        />
      )}
      {dialogState.delete && (
        <DeleteDialog
          isOpen={!!dialogState.delete}
          onOpenChange={(open) => !open && setDialogState({})}
          onConfirm={handleDelete}
          isPending={deleteMutation.isPending}
          itemName={dialogState.delete.roomNumber}
          itemType="room"
        />
      )}
    </>
  );
}