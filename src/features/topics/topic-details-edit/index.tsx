import { Dispatch, SetStateAction, useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Textarea } from '@/shared/components/ui/textarea';

import { Topic } from '@/shared/types';

import { useTopicDetailsEdit } from './hooks';

type Props = {
  topic: Topic | undefined;
  setEditMode: Dispatch<SetStateAction<boolean>>;
};

export const TopicDetailsEdit = ({ topic, setEditMode }: Props) => {
  const { metadataForm, onSubmit } = useTopicDetailsEdit({ topic, setEditMode });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsDialogOpen(true);
  };

  const handleConfirm = () => {
    metadataForm.handleSubmit(onSubmit)();
    setIsDialogOpen(false);
  };

  return (
    <>
      <Tabs defaultValue="metadata" className="mt-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
        </TabsList>
        <TabsContent value="metadata">
          <Form {...metadataForm}>
            <form onSubmit={handleSubmit} className="space-y-2 mt-6">
              <FormField
                control={metadataForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic title:</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter topic Title" {...field} />
                    </FormControl>
                    <FormDescription>Enter the title of the topics.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={metadataForm.control}
                name="picture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Picture:</FormLabel>
                    <FormControl>
                      <Input placeholder="Picture URL" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the picture URL of the topics. It will be use for avatar.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={metadataForm.control}
                name="about"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About:</FormLabel>
                    <FormControl>
                      <Textarea placeholder="About topic ..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </TabsContent>
        <TabsContent value="status">Coming soon!!!</TabsContent>
      </Tabs>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to update topic metadata?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
