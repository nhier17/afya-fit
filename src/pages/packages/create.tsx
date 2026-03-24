import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@refinedev/react-hook-form";
import { useBack, type BaseRecord, type HttpError } from "@refinedev/core";
import * as z from "zod";
import { Loader2, Package, DollarSign, Clock, Layers } from "lucide-react";

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
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";

const packageSchema = z.object({
    name: z.string().min(1, "Name is required."),
    category: z.enum(['normal', 'offer'], {
        required_error: "Category is required.",
    }),
    durationInDays: z.coerce.number({
        required_error: "Duration is required.",
        invalid_type_error: "Duration must be a number.",
    }).min(1, "Duration must be at least 1 day."),
    price: z.coerce.number({
        required_error: "Price is required.",
        invalid_type_error: "Price must be a number.",
    }).min(0, "Price cannot be negative."),
});

type PackageFormValues = z.infer<typeof packageSchema>;

const CreatePackage = () => {
    const back = useBack();

    const form = useForm<BaseRecord, HttpError, PackageFormValues>({
        resolver: zodResolver(packageSchema),
        refineCoreProps: {
            resource: "packages",
            action: "create",
            redirect: "list",
        },
        defaultValues: {
            name: "",
            category: "normal",
            durationInDays: 30,
            price: 0,
        }
    });

    const {
        refineCore: { onFinish },
        handleSubmit,
        formState: { isSubmitting },
        control,
    } = form;

    const onSubmit = async (values: PackageFormValues) => {
        try {
            await onFinish(values);
        } catch (error) {
            console.error("Error creating package: ", error);
        }
    };

    return (
        <CreateView className="member-view">
            <Breadcrumb />

            <h1 className="page-title text-3xl font-bold mb-2">Create New Package</h1>
            <div className="intro-row">
                <p>Define a new subscription package for members.</p>
                <Button onClick={() => back()}>Go Back</Button>
            </div>

            <Separator />

            <div className="my-4 flex items-center">
                <Card className="member-form-card">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                            <Package className="h-6 w-6" />
                            Package Details
                        </CardTitle>
                    </CardHeader>

                    <Separator />

                    <CardContent className="mt-6">
                        <Form {...form}>
                            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                                <FormField
                                    control={control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Package Name <span className="text-destructive">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        className="pl-9"
                                                        placeholder="e.g. Monthly Plan"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Category <span className="text-destructive">*</span></FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <div className="flex items-center gap-2">
                                                                <Layers className="h-4 w-4 text-muted-foreground" />
                                                                <SelectValue placeholder="Select category" />
                                                            </div>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="normal">Normal</SelectItem>
                                                        <SelectItem value="offer">Offer</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="durationInDays"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Duration (Days) <span className="text-destructive">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <Input
                                                            type="number"
                                                            className="pl-9"
                                                            placeholder="30"
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
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem className="md:col-span-2">
                                                <FormLabel>
                                                    Price <span className="text-destructive">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <Input
                                                            type="number"
                                                            className="pl-9"
                                                            placeholder="3000"
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        size="lg"
                                        className="flex-1 cursor-pointer"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            "Create Package"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </CreateView>
    );
};

export default CreatePackage;
