'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { X, Plus } from 'lucide-react';
import { PlanFeatures } from '@/types/models';
import { FeatureEntry } from '@/types/plans';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FeatureEditorProps {
  features: PlanFeatures;
  onChange: (features: PlanFeatures) => void;
}

const STANDARD_KEYS = ['maxMembers', 'maxTrainers', 'prioritySupport'];

const AVAILABLE_FEATURES = ['maxMembers', 'maxTrainers', 'prioritySupport'];

export function FeatureEditor({ features, onChange }: FeatureEditorProps) {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  // Derive sorted entries from the features prop
  const entries: FeatureEntry[] = Object.entries(features)
    .map(([key, value]) => ({
      key,
      value:
        typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
          ? value
          : String(value),
    }))
    .sort((a, b) => {
      const idxA = STANDARD_KEYS.indexOf(a.key);
      const idxB = STANDARD_KEYS.indexOf(b.key);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.key.localeCompare(b.key);
    });

  const handleAddFeature = () => {
    if (!newKey) {
      alert('Feature name is required');
      return;
    }

    if (!newValue.trim()) {
      alert('Feature value is required');
      return;
    }

    let parsedValue: string | number | boolean = newValue;
    if (newValue === 'true') parsedValue = true;
    else if (newValue === 'false') parsedValue = false;
    else if (!isNaN(Number(newValue)) && newValue.trim() !== '') {
      parsedValue = Number(newValue);
    }

    const newFeatures: PlanFeatures = {
      ...features,
      [newKey.trim()]: parsedValue,
    };

    onChange(newFeatures);
    setNewKey('');
    setNewValue('');
  };

  const handleRemoveFeature = (keyToRemove: string) => {
    if (STANDARD_KEYS.includes(keyToRemove)) {
      alert(`Cannot remove standard feature: ${keyToRemove}`);
      return;
    }
    const newFeatures = { ...features };
    delete newFeatures[keyToRemove];
    onChange(newFeatures);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Add Features</label>
        <div className="flex gap-2">
          <Select value={newKey} onValueChange={setNewKey}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Select Feature" />
            </SelectTrigger>

            <SelectContent>
              {AVAILABLE_FEATURES.map((feature) => (
                <SelectItem key={feature} value={feature}>
                  {feature}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Value (e.g., Unlimited, 10, true)"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddFeature();
              }
            }}
          />
          <Button
            type="button"
            onClick={handleAddFeature}
            size="sm"
            disabled={!newKey || !newValue.trim()}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {entries.length > 0 && (
        <Card className="p-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Features</label>
            <div className="space-y-2 mt-2">
              {entries.map((entry) => (
                <div key={entry.key} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="font-medium text-sm">{entry.key}</span>
                    <span className="text-xs text-muted-foreground">→</span>
                    <span className="text-sm text-muted-foreground">
                      {typeof entry.value === 'boolean' ? String(entry.value) : entry.value}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFeature(entry.key)}
                  >
                    <X className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
