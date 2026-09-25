'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useDomainTheme, DOMAIN_THEMES, DomainThemeId } from '../context/DomainContext';
import {
  Music,
  Laptop,
  Palette,
  Activity,
  Heart,
  Layers,
  Check,
  ArrowRight,
} from 'lucide-react';

export const DomainSelectionModal: React.FC = () => {
  const pathname = usePathname();
  const {
    currentDomain,
    activeSubCategory,
    isModalOpen,
    closeDomainModal,
    selectDomain,
    selectSubCategory,
  } = useDomainTheme();

  const [selectedDomainTemp, setSelectedDomainTemp] = useState<DomainThemeId>(currentDomain);
  const [selectedSubTemp, setSelectedSubTemp] = useState<string>(activeSubCategory || 'all');

  if (!isModalOpen || pathname?.startsWith('/admin')) return null;

  const activeThemeConfig = DOMAIN_THEMES.find((t) => t.id === selectedDomainTemp) || DOMAIN_THEMES[0];

  const handleDomainClick = (id: DomainThemeId) => {
    setSelectedDomainTemp(id);
    setSelectedSubTemp('all');
  };

  const handleConfirm = () => {
    selectDomain(selectedDomainTemp);
    selectSubCategory(selectedSubTemp);
    closeDomainModal();
  };

  const getCategoryIcon = (iconType: string) => {
    switch (iconType) {
      case 'music':
        return <Music className="w-4 h-4" />;
      case 'tech':
        return <Laptop className="w-4 h-4" />;
      case 'art':
        return <Palette className="w-4 h-4" />;
      case 'sports':
        return <Activity className="w-4 h-4" />;
      case 'fandom':
        return <Heart className="w-4 h-4" />;
      default:
        return <Layers className="w-4 h-4" />;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(2px)',
        WebkitBackdropFilter: 'blur(2px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.15s ease-out',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '580px',
          backgroundColor: '#ffffff',
          color: '#0f172a',
          borderRadius: '4px',
          border: '1.5px solid #000000',
          boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Compact Clean Header */}
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          <h3
            style={{
              fontSize: '15px',
              fontWeight: 900,
              color: '#000000',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            SELECT YOUR INTERESTED DOMAIN
          </h3>
          <p
            style={{
              fontSize: '12px',
              color: '#64748b',
              margin: '3px 0 0 0',
            }}
          >
            Select your favorite domain &amp; genre to customize interface, typography, and content.
          </p>
        </div>

        {/* Category Grid - Vector Icons, 4px Radius */}
        <div
          style={{
            padding: '16px 20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px',
            backgroundColor: '#fafafa',
          }}
        >
          {DOMAIN_THEMES.map((theme) => {
            const isSelected = selectedDomainTemp === theme.id;

            return (
              <div
                key={theme.id}
                onClick={() => handleDomainClick(theme.id)}
                style={{
                  borderRadius: '4px',
                  padding: '10px 12px',
                  cursor: 'pointer',
                  transition: 'all 0.12s ease',
                  backgroundColor: isSelected ? '#ffffff' : '#ffffff',
                  border: isSelected ? '2px solid #000000' : '1px solid #e2e8f0',
                  boxShadow: isSelected ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                }}
                className="hover:border-slate-400"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '4px',
                      backgroundColor: isSelected ? '#000000' : '#f1f5f9',
                      color: isSelected ? '#ffffff' : '#334155',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {getCategoryIcon(theme.iconType)}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: 800,
                        color: '#000000',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        lineHeight: 1.2,
                      }}
                    >
                      {theme.name}
                    </div>
                    <div
                      style={{
                        fontSize: '10px',
                        color: '#64748b',
                        fontFamily: theme.fontFamily,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      Font: {theme.fontDisplayName}
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: '#000000',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Check style={{ width: '12px', height: '12px', strokeWidth: 3 }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sub-Category Pills for Selected Domain */}
        {activeThemeConfig && activeThemeConfig.subCategories && activeThemeConfig.subCategories.length > 0 && (
          <div
            style={{
              padding: '12px 20px',
              backgroundColor: '#ffffff',
              borderTop: '1px solid #f1f5f9',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '8px',
              }}
            >
              GENRES IN {activeThemeConfig.name.toUpperCase()}:
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
              }}
            >
              {activeThemeConfig.subCategories.map((sub) => {
                const isSubSelected = selectedSubTemp === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setSelectedSubTemp(sub.id)}
                    style={{
                      padding: '5px 10px',
                      fontSize: '11px',
                      fontWeight: isSubSelected ? 800 : 600,
                      borderRadius: '4px',
                      border: isSubSelected ? '1.5px solid #000000' : '1px solid #cbd5e1',
                      backgroundColor: isSubSelected ? '#000000' : '#f8fafc',
                      color: isSubSelected ? '#ffffff' : '#334155',
                      cursor: 'pointer',
                      transition: 'all 0.12s ease',
                      fontFamily: activeThemeConfig.fontFamily,
                    }}
                    className="hover:border-slate-800"
                  >
                    {sub.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Action Button */}
        <div
          style={{
            padding: '14px 20px',
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e2e8f0',
          }}
        >
          <button
            onClick={handleConfirm}
            style={{
              width: '100%',
              padding: '10px 16px',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: 800,
              color: '#ffffff',
              backgroundColor: '#000000',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'background-color 0.15s ease',
            }}
            className="hover:bg-slate-800"
            type="button"
          >
            <span>Start Exploring</span>
            <ArrowRight style={{ width: '15px', height: '15px' }} />
          </button>
        </div>
      </div>
    </div>
  );
};
