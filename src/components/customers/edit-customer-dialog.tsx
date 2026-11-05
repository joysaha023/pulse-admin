"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label, Select } from "@/components/ui/input";
import { fetchJson } from "@/lib/api-client";
import { customerUpdateSchema, type CustomerUpdate } from "@/lib/validations";
import type { Customer } from "@/types";

function EditForm({ customer, onDone }: { customer: Customer; onDone: () => void }) {
  const qc = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerUpdate>({
    resolver: zodResolver(customerUpdateSchema),
    defaultValues: {
      name: customer.name,
      email: customer.email,
      company: customer.company,
      plan: customer.plan,
      status: customer.status,
    },
  });

  const mutation = useMutation({
    mutationFn: (values: CustomerUpdate) =>
      fetchJson<Customer>(`/api/customers/${customer.id}`, { method: "PATCH", body: JSON.stringify(values) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customers"] });
      qc.invalidateQueries({ queryKey: ["customer", customer.id] });
      qc.invalidateQueries({ queryKey: ["metrics"] });
      onDone();
    },
  });

  return (
    <form onSubmit={handleSubmit((v) => mutation.mutate(v))} noValidate className="space-y-4">
      {mutation.isError && (
        <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {mutation.error.message}
        </p>
      )}
      <div>
        <Label htmlFor="edit-name">Name</Label>
        <Input id="edit-name" {...register("name")} aria-invalid={!!errors.name} />
        <FieldError message={errors.name?.message} />
      </div>
      <div>
        <Label htmlFor="edit-email">Email</Label>
        <Input id="edit-email" type="email" {...register("email")} aria-invalid={!!errors.email} />
        <FieldError message={errors.email?.message} />
      </div>
      <div>
        <Label htmlFor="edit-company">Company</Label>
        <Input id="edit-company" {...register("company")} aria-invalid={!!errors.company} />
        <FieldError message={errors.company?.message} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="edit-plan">Plan</Label>
          <Select id="edit-plan" {...register("plan")}>
            <option value="free">Free</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="edit-status">Status</Label>
          <Select id="edit-status" {...register("status")}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="churned">Churned</option>
          </Select>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          Save changes
        </Button>
      </div>
    </form>
  );
}

export function EditCustomerDialog({ customer, onClose }: { customer: Customer | null; onClose: () => void }) {
  return (
    <Dialog open={!!customer} onClose={onClose} title="Edit customer" description="Changes apply to the demo data in memory.">
      {customer && <EditForm key={customer.id} customer={customer} onDone={onClose} />}
    </Dialog>
  );
}
