import { LinkType, MediaType } from '../../../../shared/constants';
import { z } from 'zod';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FieldInfo } from '@/components/Form/FieldInfo';
import { useState, useEffect } from 'react';
import useConfigForm from '@/hooks/use-config-form';
import { defaultDirectoriesFormValues } from '../../components/Form/shared-form';
import DeleteOption from '@/components/Buttons/DeleteOption';
import { useAppForm } from '@/hooks/form';
import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/lib/trpc';
import { formatConfigDataForForm } from '@/lib/formatConfigData';
import { directoryValidationSchema } from '@/types/config';
import { FormValidationProvider } from '@/contexts/Form/form-validation-provider';
import { pickSchemaFields } from '@/lib/pick-schema-fields';
import { createFileRoute } from '@tanstack/react-router';
import { Page } from '@/components/Page';
import { useSettingsFormSubmit } from '@/hooks/use-settings-form-submit';
import { RuntimeConfig, DataDirectory } from '../../../../shared/configSchema';

type DirectoryFormData = z.infer<typeof directoryValidationSchema>;

function DirectorySettings() {
  const { isFieldRequired } = useConfigForm(directoryValidationSchema);

  const trpc = useTRPC();
  const { data: configData } = useQuery(
    trpc.settings.get.queryOptions(undefined, {
      select: (data: {
        config: RuntimeConfig;
        apikey: string;
      }): Partial<DirectoryFormData> => {
        const fullDataset = formatConfigDataForForm(data.config);
        const filteredData = pickSchemaFields(
          directoryValidationSchema,
          fullDataset,
          { includeUndefined: true },
        );

        return filteredData;
      },
    }),
  );

  const handleSubmit = useSettingsFormSubmit();

  const form = useAppForm({
    defaultValues: (configData ??
      defaultDirectoriesFormValues) as DirectoryFormData,
    onSubmit: handleSubmit,
    validators: {
      onSubmit: directoryValidationSchema,
    },
  });

  /**
   * Focus on the newly added field in array fields
   */
  const [lastFieldAdded, setLastFieldAdded] = useState<string | null>(null);
  useEffect(() => {
    if (lastFieldAdded) {
      const el = document.getElementById(lastFieldAdded);
      el?.focus();
      setLastFieldAdded(null);
    }
  }, [lastFieldAdded]);

  return (
    <Page>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Directory & Path Settings</h1>
          <p className="text-muted-foreground">
            Manage the directories and paths used by cross-seed.
          </p>
        </div>
        <FormValidationProvider isFieldRequired={isFieldRequired}>
          <form
            className="form flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            noValidate
          >
            {/* form fields */}
            <div className="flex flex-wrap gap-6">
              <fieldset className="form-fieldset w-full gap-6">
                <div className="">
                  <form.Field name="dataDirs" mode="array">
                    {(field) => (
                      <div className="space-y-3">
                        <Label htmlFor={field.name} className="block w-full">
                          Data Directories
                          {isFieldRequired(field.name) && (
                            <span className="pl-1 text-red-500">*</span>
                          )}
                        </Label>
                        {field.state.value.map(
                          (value: string | DataDirectory, index: number) => {
                            const dirPath = typeof value === 'string' ? value : value.path;
                            const mediaType = typeof value === 'string' ? undefined : value.mediaType;

                            return (
                              <div key={`${field.name}-${index}`} className="mb-3 space-y-2 rounded-lg border p-3">
                                <div className="flex items-center gap-2">
                                  <div className="flex-1">
                                    <Label htmlFor={`${field.name}-${index}-path`} className="text-xs">
                                      Path
                                    </Label>
                                    <Input
                                      id={`${field.name}-${index}-path`}
                                      type="text"
                                      className="form-input mt-1"
                                      value={dirPath}
                                      placeholder="/path/to/media"
                                      aria-invalid={
                                        !!(
                                          field.state.meta.isTouched &&
                                          field.state.meta.errorMap.onBlur
                                        )
                                      }
                                      onBlur={(e) => {
                                        field.state.value[index] = mediaType
                                          ? { path: e.target.value, mediaType }
                                          : e.target.value;
                                        field.handleChange(field.state.value);
                                      }}
                                      onChange={(e) => {
                                        const newValue = mediaType
                                          ? { path: e.target.value, mediaType }
                                          : e.target.value;
                                        const updatedValues = [...field.state.value];
                                        updatedValues[index] = newValue;
                                        field.handleChange(updatedValues);
                                      }}
                                    />
                                  </div>

                                  <div className="w-40">
                                    <Label htmlFor={`${field.name}-${index}-mediaType`} className="text-xs">
                                      Media Type
                                    </Label>
                                    <form.Field
                                      name={`${field.name}[${index}].mediaType`}
                                      validators={{
                                        onBlur: z.nativeEnum(MediaType).optional(),
                                      }}
                                    >
                                      {(mediaField) => (
                                        <div className="mt-1">
                                          <select
                                            id={`${field.name}-${index}-mediaType`}
                                            className="w-full rounded-md border px-3 py-2 text-sm"
                                            value={mediaType ?? ''}
                                            onChange={(e) => {
                                              const selectedMediaType = e.target.value === ''
                                                ? undefined
                                                : e.target.value as MediaType;
                                              const newValue = selectedMediaType
                                                ? { path: dirPath, mediaType: selectedMediaType }
                                                : dirPath;
                                              const updatedValues = [...field.state.value];
                                              updatedValues[index] = newValue;
                                              field.handleChange(updatedValues);
                                            }}
                                          >
                                            <option value="">Auto-detect</option>
                                            {Object.entries(MediaType).map(([key, value]) => (
                                              <option key={key} value={value}>
                                                {key.charAt(0) + key.slice(1).toLowerCase()}
                                              </option>
                                            ))}
                                          </select>
                                        </div>
                                      )}
                                    </form.Field>
                                  </div>

                                  {field.state.value.length > 1 && (
                                    <DeleteOption
                                      onClick={() => {
                                        field.removeValue(index);
                                      }}
                                      className="mt-4"
                                    />
                                  )}
                                </div>

                                {field.state.meta.isTouched &&
                                  field.state.meta.errors && (
                                    <FieldInfo
                                      fieldMeta={field.state.meta}
                                    />
                                  )}
                              </div>
                            );
                          },
                        )}
                        <Button
                          variant="secondary"
                          type="button"
                          onClick={() => {
                            field.pushValue('');
                            setLastFieldAdded(
                              `${field.name}-${field.state.value.length - 1}`,
                            );
                          }}
                          title={`Add ${field.name}`}
                        >
                          Add
                        </Button>
                      </div>
                    )}
                  </form.Field>
                </div>
                <form.AppField name="flatLinking">
                  {(field) => (
                    <field.SwitchField
                      label="Flat Linking"
                      className="form-field__switch flex flex-col items-start gap-5"
                    />
                  )}
                </form.AppField>
                <div className="">
                  <form.AppField name="linkType">
                    {(field) => (
                      <field.SelectField label="Link Type" options={LinkType} />
                    )}
                  </form.AppField>
                </div>
                <div className="">
                  <form.Field name="linkDirs" mode="array">
                    {(field) => {
                      return (
                        <div className="space-y-3">
                          <Label htmlFor={field.name} className="block w-full">
                            Link Directories
                            {isFieldRequired(field.name) && (
                              <span className="pl-1 text-red-500">*</span>
                            )}
                          </Label>
                          {field.state.value?.map(
                            (_: string, index: number) => {
                              return (
                                <div
                                  key={index}
                                  className="gap-y- mb-3 flex flex-col"
                                >
                                  <form.AppField
                                    name={`linkDirs[${index}]`}
                                    validators={{
                                      onBlur: z.string(),
                                    }}
                                  >
                                    {(subfield) => (
                                      <subfield.ArrayField
                                        showDelete={
                                          (field.state.value &&
                                            field.state.value?.length > 1) ??
                                          undefined
                                        }
                                        index={index}
                                        onDelete={() => {
                                          field.removeValue(index);
                                        }}
                                      />
                                    )}
                                  </form.AppField>
                                  <form.Subscribe
                                    selector={(f) =>
                                      f.fieldMeta[
                                        `${field.name}[${index}]` as keyof typeof f.fieldMeta
                                      ]
                                    }
                                  >
                                    {(fieldMeta) => (
                                      <FieldInfo fieldMeta={fieldMeta} />
                                    )}
                                  </form.Subscribe>
                                </div>
                              );
                            },
                          )}
                          <Button
                            variant="secondary"
                            type="button"
                            onClick={() => {
                              field.pushValue('');
                              const newFieldId = `${field.name}-${field.state.value?.length ? field.state.value.length - 1 : 0}`;
                              setLastFieldAdded(newFieldId);
                            }}
                            title={`Add ${field.name}`}
                          >
                            Add
                          </Button>
                        </div>
                      );
                    }}
                  </form.Field>
                </div>
                <div className="">
                  <form.AppField name="maxDataDepth">
                    {(field) => <field.NumberField label="Max Data Depth" />}
                  </form.AppField>
                </div>
              </fieldset>
              <form.AppForm>
                <form.SubmitButton />
              </form.AppForm>
            </div>
          </form>
        </FormValidationProvider>
      </div>
    </Page>
  );
}

export const Route = createFileRoute('/settings/directories')({
  component: DirectorySettings,
});
