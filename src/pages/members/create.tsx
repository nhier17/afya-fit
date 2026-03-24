import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@refinedev/react-hook-form";
import { useBack, useList, type BaseRecord, type HttpError  } from "@refinedev/core";
import * as z from "zod";
import { format } from "date-fns";
import {
    CalendarIcon,
    Loader2,
    User,
    Phone,
    DollarSign,
    Users,
    BadgeCheck,
    PackagePlus,
    CreditCard,
    Ticket
} from "lucide-react";

import { CreateView } from "@/components/refine-ui/views/create-view";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import type { Package } from "@/types";


const memberSchema = z.object({
    firstName: z.string().min(1, "First name is required."),
    lastName: z.string().min(1, "Last name is required."),
    gender: z.enum(['male', 'female']),
    phone: z
        .string()
        .min(10)
        .regex(/^(0|\+254|254)/, "Invalid Kenyan phone format"),
    memberType: z.enum(['normal', 'gym']),
    packageId: z.string({
        required_error: "Package is required.",
        invalid_type_error: "Package must be a number.",
    }),
    paymentDate: z.coerce.date({
        required_error: "Payment date is required.",
    }),
    startDate: z.coerce.date({
        required_error: "Start date is required.",
    }),
    registrationFee: z.coerce.number().min(0),
    amountPaid: z.coerce.number({
        required_error: "Amount paid is required.",
        invalid_type_error: "Amount paid must be a number.",
    }),
    paymentMethod: z.enum(['cash', 'm-pesa', 'paybill', 'cheque']),
    registrationOption: z.enum(['none', 'add']),
});

type MemberFormValues = z.infer<typeof memberSchema>;


const CreateMember = () => {
    const back = useBack();

    const form = useForm<BaseRecord, HttpError,MemberFormValues>({
        resolver: zodResolver(memberSchema),
        refineCoreProps: {
            resource: "members",
            action: "create",
            redirect: "list",
        },
        defaultValues: {
            firstName: "",
            lastName: "",
            gender: "male",
            phone: "",
            memberType: "normal",
            packageId: "",
            startDate: new Date(),
            paymentDate: new Date(),
            amountPaid: 0,
            paymentMethod: "m-pesa",
            registrationOption: "none",
            registrationFee: 0,
        }
    });

    const {
        refineCore: { onFinish },
        handleSubmit,
        formState: { isSubmitting },
        control,
        setValue,
    } = form;

    const onSubmit = async (values: MemberFormValues) => {
        try {
            await onFinish(values);
        } catch (error) {
            console.error("Error creating member:", error);
        }
    };

    const { query: packagesQuery } = useList<Package>({
        resource: "packages",
        pagination: { mode: "off" },
    })

    const packages = packagesQuery?.data?.data || [];
    console.log("packages", packages);
    const isLoadingPackages = packagesQuery?.isLoading;

    return (
        <CreateView className="member-view">
            <Breadcrumb />
            <h1 className="page-title">Register new member</h1>
            <div className="intro-row">
                <p>Provide the required information below to register a member.</p>
                <Button onClick={() => back()} variant="outline">Go Back</Button>
            </div>

            <Separator />

            <div className="my-4 flex items-center">
                <Card className="member-form-card">
                    <CardHeader className="relative z-10">
                        <CardTitle className="text-2xl pb-0 font-bold text-gradient-orange">Member Information</CardTitle>
                    </CardHeader>

                    <Separator />

                    <CardContent className="mt-7">
                        <Form {...form}>
                            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={control}
                                        name="firstName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    First Name<span className="text-orange-600">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                        <Input
                                                            className="pl-9"
                                                            placeholder="Enter first name"
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="lastName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Last Name <span className="text-orange-600">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                        <Input
                                                            className="pl-9"
                                                            placeholder="Enter last name"
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="gender"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Gender</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <div className="flex items-center gap-2">
                                                                <Users className="h-4 w-4 text-muted-foreground" />
                                                            <SelectValue placeholder="Select gender" />
                                                            </div>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="male">Male</SelectItem>
                                                        <SelectItem value="female">Female</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Phone Number <span className="text-orange-600">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                        <Input
                                                            className="pl-9"
                                                            placeholder="e.g. 0712345678"
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={control}
                                        name="memberType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Member Type <span className="text-orange-600">*</span>
                                                </FormLabel>
                                                <Select
                                                    onValueChange={(val) => {
                                                        field.onChange(val);
                                                    }}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <div className="flex items-center gap-2">
                                                                <BadgeCheck className="size-4" />
                                                            <SelectValue placeholder="Select type" />
                                                            </div>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="normal">Normal</SelectItem>
                                                        <SelectItem value="gym">Gym Offer</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="packageId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Package <span className="text-orange-600">*</span>
                                                </FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value ? String(field.value) : ""}
                                                    disabled={isLoadingPackages}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <div className="flex items-center gap-2">
                                                                <PackagePlus className="size-4" />
                                                                <SelectValue placeholder="Select a package" />
                                                            </div>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {packages.map((pkg) => (
                                                            <SelectItem key={pkg.id} value={pkg.id}>
                                                                {pkg.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={control}
                                        name="amountPaid"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Amount Paid</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                        <Input
                                                            type="number"
                                                            {...field}
                                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="paymentMethod"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Payment Method</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <div className="flex items-center gap-2">
                                                                <CreditCard className="size-4" />
                                                            <SelectValue placeholder="Select payment method" />
                                                            </div>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="cash">Cash</SelectItem>
                                                        <SelectItem value="m-pesa">M-Pesa</SelectItem>
                                                        <SelectItem value="paybill">Paybill</SelectItem>
                                                        <SelectItem value="cheque">Cheque</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="paymentDate"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Payment Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-full pl-3 text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                    format(field.value, "PPP")
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) =>
                                                                date < new Date("1900-01-01")
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="startDate"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Start Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-full pl-3 text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                    format(field.value, "PPP")
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) =>
                                                                date < new Date("1900-01-01")
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={control}
                                    name="registrationOption"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Registration Fee</FormLabel>
                                            <Select
                                                onValueChange={(val: 'none' | 'add') => {
                                                    field.onChange(val);

                                                    if (val === "add") {
                                                        setValue("registrationFee", 500); // auto set fee
                                                    } else {
                                                        setValue("registrationFee", 0); // reset
                                                    }
                                                }}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <div className="flex items-center gap-2">
                                                            <Ticket className="size-4" />
                                                        <SelectValue placeholder="Select registration state" />
                                                        </div>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="none">No Registration Fee</SelectItem>
                                                    <SelectItem value="add">Add Registration fee</SelectItem>
                                                </SelectContent>
                                            </Select>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {form.watch("registrationOption") === "add" && (
                                    <FormField
                                        control={control}
                                        name="registrationFee"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Registration Fee Amount</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} disabled />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                )}

                                <div className="flex gap-4 pt-4">
                                    <Button
                                        type="submit"
                                        size="lg"
                                        disabled={isSubmitting}
                                        className="flex-1 cursor-pointer"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Creating...
                                            </>
                                        ) : "Create Member"}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </CreateView>
    )
}

export default CreateMember;